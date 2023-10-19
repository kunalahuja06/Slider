using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Data.Contracts;
using Data.Models;
using Microsoft.AspNetCore.SignalR;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;

namespace SliderAPI.Services
{
    public class ContentService: IContentService
    {
        private readonly IConfiguration Configuration;
        private readonly string connectionString;
        private readonly string containerName;
        private readonly BlobServiceClient blobServiceClient;
        private readonly BlobContainerClient containerClient;
        private readonly IHubContext<SliderHub> hubContext;
        public ContentService(IConfiguration configuration, IHubContext<SliderHub> hubContext)
        {
            Configuration = configuration;
            connectionString = Configuration["AzureStorageConfig:ConnectionString"];
            containerName = Configuration["AzureStorageConfig:ContainerName"];
            blobServiceClient = new BlobServiceClient(connectionString);
            containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            this.hubContext = hubContext;
        }

        public async Task<List<AzureFileContent>> GetAll()
        {
            try
            {

                List<AzureFileContent> contents = new();

                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    AzureFileContent content = new()
                    {
                        Id = blobItem.Metadata["id"],
                        Slot = blobItem.Metadata["slot"],
                        Category = blobItem.Metadata["category"],
                        Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                        SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                    };
                    contents.Add(content);
                }

                return contents;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<AzureFileContent>> GetContentBySlot(string slot)
        {
            try
            {
                List<AzureFileContent> contents = new();

                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    if (IsTimeSlotInRange(slot, blobItem.Metadata["slot"]))
                    {
                        AzureFileContent content = new()
                        {
                            Id = blobItem.Metadata["id"],
                            Slot = blobItem.Metadata["slot"],
                            Category = blobItem.Metadata["category"],
                            Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                            SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                        };
                        contents.Add(content);
                    }
                }
                return contents;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> UploadContent(ViewFileContent fileContent)
        {
            try
            {
                List<string> uploadedFilesUrl = new();

                string slot = fileContent.Slot;
                string category = fileContent.Category;
                string slideOrder = fileContent.SlideOrder.ToString();

                foreach(var file in fileContent.Files)
                {
                    string fileName = file.FileName;
                    string id = Guid.NewGuid().ToString();

                    BlobClient blobClient = containerClient.GetBlobClient(fileName);
                    await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType });
                    blobClient.SetMetadata(new Dictionary<string, string>
                    {
                        { "slot", slot },
                        { "category", category },
                        { "id", id },
                        { "slideOrder",slideOrder }
                    });
                    uploadedFilesUrl.Add(blobClient.Uri.ToString());

                    AzureFileContent azureFileContent = new()
                    {
                        Id = id,
                        Slot = slot,
                        Category = category,
                        Url = blobClient.Uri.ToString(),
                        SlideOrder = Convert.ToInt32(slideOrder)
                    };

                    await hubContext.Clients.All.SendAsync("ReceiveContent", azureFileContent);

                }
                return uploadedFilesUrl.Count > 0;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> DeleteContent(string id)
        {
            try
            {
                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    if (blobItem.Metadata["id"] == id)
                    {
                        await containerClient.DeleteBlobAsync(blobItem.Name);
                        await hubContext.Clients.All.SendAsync("ReceiveDeletedContent", id);
                        return true;
                    }
                }

                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<AzureFileContent> GetContentById(string id)
        {
            try
            {
                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    if (blobItem.Metadata["id"] == id)
                    {
                        AzureFileContent content = new()
                        {
                            Id = blobItem.Metadata["id"],
                            Slot = blobItem.Metadata["slot"],
                            Category = blobItem.Metadata["category"],
                            Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                            SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                        };
                        return content;
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> UpdateContent(UpdateFileContent content)
        {
            try
            {
                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    if (blobItem.Metadata["id"] == content.Id)
                    {
                        BlobClient blobClient = containerClient.GetBlobClient(blobItem.Name);
                        blobClient.SetMetadata(new Dictionary<string, string>
                        {
                            {"id", content.Id },
                            { "slot", content.Slot },
                            { "category", content.Category },
                            { "slideOrder", content.SlideOrder.ToString() }
                        });

                        AzureFileContent updatedContent = new()
                        {
                            Id = content.Id,
                            Slot = content.Slot,
                            Category = content.Category,
                            Url = blobClient.Uri.ToString(),
                            SlideOrder = Convert.ToInt32(content.SlideOrder)
                        };
                        await hubContext.Clients.All.SendAsync("ReceiveUpdatedContent", updatedContent);

                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<List<AzureFileContent>> GetContentByCategory(string category)
        {
            try
            {
                List<AzureFileContent> content = new();

                BlobTraits blobTraits = BlobTraits.Metadata;
                BlobStates blobStates = BlobStates.None;

                await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
                {
                    if (blobItem.Metadata["category"] == category)
                    {
                        AzureFileContent fileContent = new()
                        {
                            Id = blobItem.Metadata["id"],
                            Slot = blobItem.Metadata["slot"],
                            Category = blobItem.Metadata["category"],
                            Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                            SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                        };
                        content.Add(fileContent);
                    }
                }
                return content;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async Task<List<AzureFileContent>> GetFilteredContent(FilterOptions options)
        {
            List<AzureFileContent> filteredContents = new();

            BlobTraits blobTraits = BlobTraits.Metadata;
            BlobStates blobStates = BlobStates.None;

            await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
            {
                if(!string.IsNullOrEmpty(options.Category))
                {
                    if(!string.IsNullOrEmpty(options.Slot))
                    {
                        if (blobItem.Metadata["slot"] == options.Slot && blobItem.Metadata["category"] == options.Category)
                        {
                            AzureFileContent content = new()
                            {
                                Id = blobItem.Metadata["id"],
                                Slot = blobItem.Metadata["slot"],
                                Category = blobItem.Metadata["category"],
                                Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                                SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                            };
                            filteredContents.Add(content);
                        }
                    }
                    else
                    {
                        if (blobItem.Metadata["category"] == options.Category)
                        {
                            AzureFileContent content = new()
                            {
                                Id = blobItem.Metadata["id"],
                                Slot = blobItem.Metadata["slot"],
                                Category = blobItem.Metadata["category"],
                                Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                                SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                            };
                            filteredContents.Add(content);
                        }
                    }
                }
                else
                {
                    if(!string.IsNullOrEmpty(options.Slot))
                    {
                        if (blobItem.Metadata["slot"] == options.Slot)
                        {
                            AzureFileContent content = new()
                            {
                                Id = blobItem.Metadata["id"],
                                Slot = blobItem.Metadata["slot"],
                                Category = blobItem.Metadata["category"],
                                Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                                SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                            };
                            filteredContents.Add(content);
                        }
                    }
                    else
                    {
                        AzureFileContent content = new()
                        {
                            Id = blobItem.Metadata["id"],
                            Slot = blobItem.Metadata["slot"],
                            Category = blobItem.Metadata["category"],
                            Url = containerClient.GetBlobClient(blobItem.Name).Uri.ToString(),
                            SlideOrder = Convert.ToInt32(blobItem.Metadata["slideOrder"])
                        };
                        filteredContents.Add(content);
                    }
                }
            }
            return filteredContents;
        }

        private bool IsTimeSlotInRange(string targetSlot, string slotToCheck)
        {
            // Parse the start time from the target and slot to check
            DateTime targetStartTime = DateTime.Parse(targetSlot.Split('-')[0]);
            DateTime slotStartTime = DateTime.Parse(slotToCheck.Split('-')[0]);

            // Define the start and end times for the range (11:00 to 12:00)
            DateTime rangeStartTime = new DateTime(targetStartTime.Year, targetStartTime.Month, targetStartTime.Day, 11, 0, 0);
            DateTime rangeEndTime = new DateTime(targetStartTime.Year, targetStartTime.Month, targetStartTime.Day, 12, 0, 0);

            // Check if the slot to check falls within the range
            return slotStartTime >= rangeStartTime && slotStartTime < rangeEndTime;
        }
    }
}
