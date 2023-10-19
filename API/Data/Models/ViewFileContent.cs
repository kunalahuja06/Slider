using Microsoft.AspNetCore.Http;

namespace Data.Models
{
    public class ViewFileContent
    {
        public List<IFormFile> Files { get; set; }
        public string Slot { get; set; }
        public string Category { get; set; }
        public int SlideOrder { get; set; }
    } 
}
