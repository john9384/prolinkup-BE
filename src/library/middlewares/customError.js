class CustomValidationError extends Error {
  constructor(err_obj) {
    super(err_obj);
    this.name = "Validation Error";
    this.field = err_obj.field;
    this.detail = err_obj.detail;
    this.msg = err_obj.detail;
  }
}

module.exports = CustomValidationError;
