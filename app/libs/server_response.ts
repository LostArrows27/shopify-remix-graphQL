export class ServerResponse {
  static success<T extends { data: any }>({
    data,
    message = "Success",
  }: {
    data: T["data"];
    message?: string;
  }) {
    return Response.json({
      message,
      status: "success",
      data,
    });
  }

  static error<T extends { data: any }>({
    data = null,
    message = "Error",
  }: {
    data?: T["data"] | null;
    message?: string;
  }) {
    return Response.json({
      message,
      status: "error",
      data,
    });
  }
}
