beforeEach(function () {
    this.addMatchers({
        toBeInstanceof: function (classRef) {
            return this.actual instanceof classRef;
        }
    });
    this.addMatchers({
        toBeAnArray: function () {
            return Array.isArray(this.actual);
        }
    });
});
