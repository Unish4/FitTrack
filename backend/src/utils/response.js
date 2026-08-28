export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: typeof error === "string" ? error : error.message || "Server Error",
  });
};

export const paginatedResponse = (res, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    count: data.length,
    pagination: {
      currentPage: page,
      totalPages,
      total,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data,
  });
};
