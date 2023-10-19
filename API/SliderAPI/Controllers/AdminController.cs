using Data.Concerns;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Data.Contracts;
using Microsoft.AspNetCore.Authorization;

namespace SliderAPI.Controllers
{
    [Authorize]
    [Route("api/admin")]
    public class AdminController : Controller
    {
        private readonly IContentService contentService;
        public AdminController(IContentService contentService)
        {
            this.contentService = contentService;
        }

        [HttpPost("upload")]
        public async Task<IApiResponse<bool>> Upload([FromForm] ViewFileContent content)
        {
            try
            {
                bool uploaded = await contentService.UploadContent(content);

                if(!uploaded)
                {
                    return new ApiResponse<bool>
                    {
                        IsSuccess = false,
                        StatusCode = HttpStatusCode.BadRequest,
                        Error = new ErrorObject
                        {
                            Message = "Content not uploaded",
                        }
                    };
                }
                return new ApiResponse<bool>
                {
                    IsSuccess = uploaded,
                    StatusCode = HttpStatusCode.OK,
                    Data = uploaded
                };
            }
            catch(Exception ex)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpDelete("Delete")]
        public async Task<IApiResponse<bool>> Delete([FromQuery]string id)
        {
            try
            {
                bool deleted = await contentService.DeleteContent(id);

                if(!deleted)
                {
                    return new ApiResponse<bool>
                    {
                        IsSuccess = false,
                        StatusCode = HttpStatusCode.NotFound,
                        Error = new ErrorObject
                        {
                            Message = "Content not found",
                        }
                    };
                }

                return new ApiResponse<bool>
                {
                    IsSuccess = deleted,
                    StatusCode = HttpStatusCode.OK,
                    Data = deleted
                };
            }
            catch(Exception ex)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpGet("content")]
        public async Task<IApiResponse<AzureFileContent>> GetContentById([FromQuery]string id)
        {
            try
            {
                AzureFileContent content = await contentService.GetContentById(id);

                if(content == null)
                {
                    return new ApiResponse<AzureFileContent>
                    {
                        IsSuccess = false,
                        StatusCode = HttpStatusCode.NotFound,
                        Error = new ErrorObject
                        {
                            Message = "Content not found",
                        }
                    };
                }

                return new ApiResponse<AzureFileContent>
                {
                    IsSuccess = true,
                    StatusCode = HttpStatusCode.OK,
                    Data = content
                };
            }
            catch(Exception ex)
            {
                return new ApiResponse<AzureFileContent>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpGet("contents")]
        public async Task<IApiResponse<List<AzureFileContent>>> GetAll()
        {
            try
            {
                List<AzureFileContent> contents = await contentService.GetAll();

                return new ApiResponse<List<AzureFileContent>>
                {
                    IsSuccess = true,
                    StatusCode = HttpStatusCode.NotFound,
                    Data = contents
                };
            }
            catch(Exception ex)
            {
                return new ApiResponse<List<AzureFileContent>>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpPut("update")]
        public async Task<IApiResponse<bool>> UpdateContent([FromBody] UpdateFileContent content)
        {
            try
            {
                bool updated = await contentService.UpdateContent(content);

                if (!updated)
                {
                    return new ApiResponse<bool>
                    {
                        IsSuccess = false,
                        StatusCode = HttpStatusCode.NotFound,
                        Error = new ErrorObject
                        {
                            Message = "Content not found",
                        }
                    };
                }

                return new ApiResponse<bool>
                {
                    IsSuccess = updated,
                    StatusCode = HttpStatusCode.OK,
                    Data = updated
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool>
                {
                    IsSuccess = false,
                    StatusCode = HttpStatusCode.BadRequest,
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpGet("contents/category")]
        public async Task<IApiResponse<List<AzureFileContent>>> GetContentByCatgeory([FromQuery]string category)
        {
            try
            {
                List<AzureFileContent> contents = await contentService.GetContentByCategory(category);

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
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }

        [HttpPost("contents/filtered")]
        public async Task<IApiResponse<List<AzureFileContent>>> GetContentByCatgeory([FromBody]FilterOptions filters)
        {
            try
            {
                List<AzureFileContent> contents = await contentService.GetFilteredContent(filters);

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
                    Error = new ErrorObject
                    {
                        Message = ex.Message,
                    }
                };
            }
        }
    }
}
