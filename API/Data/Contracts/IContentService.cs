using Data.Models;

namespace Data.Contracts
{
    public interface IContentService
    {
        public Task<List<AzureFileContent>> GetAll();
        public Task<List<AzureFileContent>> GetContentBySlot(string slot);
        public Task<bool> UploadContent(ViewFileContent fileContent);
        public Task<bool> DeleteContent(string id);
        public Task<AzureFileContent> GetContentById(string id);
        public Task<bool> UpdateContent(UpdateFileContent content);
        public Task<List<AzureFileContent>> GetContentByCategory(string category);
        public Task<List<AzureFileContent>> GetFilteredContent(FilterOptions filters);
    }
}
