using System.Net;

namespace Data.Concerns
{
    public class ApiResponse<T>:IApiResponse<T>
    {
        public T? Data { get; set; }
        public bool IsSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public ErrorObject? Error { get; set; }

        public static ApiResponse<T> Success(T data)
        {
            ApiResponse<T> response = new ApiResponse<T>
            {
                IsSuccess = true,
                StatusCode = HttpStatusCode.OK,
                Data = data
            };
            return response;
        }

        public static async Task<ApiResponse<T>> SuccessAsync(T data)
        {
            return await Task.FromResult(Success(data));
        }

        public static ApiResponse<T> Failure(T data, string message = "")
        {
            ApiResponse<T> apiResponse = new()
            {
                Data = data,
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest,
                Error = new ErrorObject { Message = message }
            };
            return apiResponse;
        }

    }
}
