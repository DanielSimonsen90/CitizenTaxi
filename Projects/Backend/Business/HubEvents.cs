namespace Business;

/// <summary>
/// This class contains all the events that are used in the SignalR hub in the frontend.
/// </summary>
public static class HubEvents
{
    /// <summary>
    /// When a notification should be sent to the frontend with the updated information about the taxi.
    /// </summary>
    public const string NOTIFICATION = "notified";

    /// <summary>
    /// Log event for tracing the process of the SignalR hub.
    /// </summary>
    public const string LOG = "log";

    /// <summary>
    /// Error event for sending errors to the frontend.
    /// </summary>
    public const string ERROR = "error";
}
