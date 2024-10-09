const ApiError = require("./apiError");

const ChecksuspendedAccount = (user, next) => {
  if (user.suspended) {
    // هنا يتم إرجاع الخطأ إذا كان الحساب معلقًا
    throw next(
      new ApiError(
        "Your account has been suspended. Please contact the support team to reactivate your account.",
        403
      )
    );
  }
};

module.exports = ChecksuspendedAccount;
