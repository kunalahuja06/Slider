namespace SliderAPI.Services
{
    public interface IImageService
    {
        public List<string> GetAll();
        public Task<List<string>> GetImagesBySlot(string slot);
    }
}
