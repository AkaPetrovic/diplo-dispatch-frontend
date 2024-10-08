export default interface ErrorMessage {
  body: {
    type: string;
    title: string;
    status: number;
    detail: string;
  };
  statusCode: string;
}
