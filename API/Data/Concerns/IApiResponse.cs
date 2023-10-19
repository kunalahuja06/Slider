using System.Net;

namespace Data.Concerns
{
    public interface IApiResponse<T>: IResponse
    {
        T? Data { get; set; }
    }
    public class ErrorObject
    {
        public string? Message { get; set; }
    }
    public interface IResponse
    {
        bool IsSuccess { get; set; }
        HttpStatusCode StatusCode { get; set; }
        ErrorObject? Error { get; set; }

    }
}
