export function successResponse<T>(
  res: any,
  message: string,
  data: T,
  status = 201
) {
  return res.status(status).json({
    success: true,
    message: message,
    data,
  });
}

export function errorResponse(
  res: any,
  message: string,
  status = 404,
  details?: any
) {
  return res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
  });
}
