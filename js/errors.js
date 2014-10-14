exports.NotImplementedError = function() {
  this.name="NotImplementedErrori";
  this.message="please replace this with a runtime specific callback";
};
exports.NotImplementedError.prototype=Object.create(Error.prototype);
