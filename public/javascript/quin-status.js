const quinStatus = [10];

const quin = () => {
	const currentUserQuin = document.querySelector('#quin');
	currentUserQuin.innerHTML = quinStatus[0];
};

(() => {
	try {
		if (elsewhere) {
			quinStatus.pop();
			quinStatus.push(elsewhere.quin);
			return quin();
		}
	} catch (e) {
		return quin();
	}
})();
