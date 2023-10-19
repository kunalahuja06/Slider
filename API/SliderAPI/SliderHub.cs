using Data.Models;
using Microsoft.AspNetCore.SignalR;

namespace SliderAPI
{
    public class SliderHub:Hub
    {
        public async Task SendNewContent(AzureFileContent content)
        {
            await Clients.All.SendAsync("ReceiveContent", content);
        }

        public async Task SendUpdatedContent(AzureFileContent content)
        {
            await Clients.All.SendAsync("ReceiveUpdatedContent", content);
        }

        public async Task SendDeletedContent(string id)
        {
            await Clients.All.SendAsync("ReceiveDeletedContent", id);
        }
    }
}
