using Data.Concerns;
using Data.Contracts;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace SliderAPI.Controllers
{
    [Route("api/[controller]")]
    public class ContentController : Controller
    {
        private readonly IContentService contentService;

        public ContentController(IContentService contentService)
        {
            this.contentService = contentService;
        }

        [HttpGet]
        public async Task<IApiResponse<List<AzureFileContent>>> GetContentBySlot([FromQuery]string slot)
        {
            try
            {
                List<AzureFileContent> contents = await contentService.GetContentBySlot(slot);

                return new ApiResponse<List<AzureFileContent>>
                {
                    IsSuccess = true,
                    StatusCode = HttpStatusCode.OK,
                    Data = contents
                };
            }
            catch(Exception ex)
            {
                return new ApiResponse<List<AzureFileContent>>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Data = null,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }
    }
}
