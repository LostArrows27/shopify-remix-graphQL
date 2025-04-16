export class ServerResponse {
  static success<T>({
    data,
    message = "Success",
  }: {
    data: T;
    message?: string;
  }) {
    return Response.json({
      message,
      status: "success",
      data,
    });
  }

  static error<T>({
    data = null,
    message = "Error",
  }: {
    data?: T | null;
    message?: string;
  }) {
    return Response.json({
      message,
      status: "error",
      data,
    });
  }
}
