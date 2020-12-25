module.exports = asyncFunc => {
	return (req, res, next) => {
		asyncFunc(req, res, next).catch(next);
	};
};

// module.exports = asyncFunc => {
// 	return (req, res, next) => {
// 		asyncFunc(req, res, next).catch(err => next(err));
// 	};
// };

// module.exports = asyncFunc => {
// 	return asyncFunc(req, res, next).catch(err => next(err));
// };
