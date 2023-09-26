using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System.Reflection.Emit;

namespace SliderAPI.Services
{
    public class ImageService : IImageService
    {
        private IConfiguration configuration;

        public ImageService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public List<string> GetAll()
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<string>> GetImagesBySlot(string slot)
            {
            List<string> images = new List<string>();
            string connectionString = configuration["AzureStorageConfig:ConnectionString"];
            string containerName = configuration["AzureStorageConfig:ContainerName"];

            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);

            BlobTraits blobTraits = BlobTraits.Metadata;
            BlobStates blobStates = BlobStates.All;

            await foreach (BlobItem blobItem in containerClient.GetBlobsAsync(blobTraits, blobStates))
            {
                if (blobItem.Metadata["slot"] == slot)
                {
                    string blobName = blobItem.Name;
                    Uri blobUri = containerClient.GetBlobClient(blobName).Uri;
                    images.Add(blobUri.ToString());
                }
            }
            
            return images;

        }
    }
}
