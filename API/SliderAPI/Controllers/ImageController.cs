using Microsoft.AspNetCore.Mvc;
using SliderAPI.Services;

namespace SliderAPI.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        private IImageService imageService;

        public ImageController(IImageService imageService)
        {
            this.imageService = imageService;
        }

        [HttpGet("{slot}")]
        public async Task<IActionResult> GetImagesBySlot(string slot)
        {
            try
            {
                List<string> images = await imageService.GetImagesBySlot(slot);

                return Ok(images);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
