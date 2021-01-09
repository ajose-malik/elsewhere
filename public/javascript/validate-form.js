// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll('.needs-validation');

	// Max number of file upload
	const maxFileNumber = () => {
		const fileInput = document.querySelector('#image');
		const fileSubmit = document.querySelector('#imageSubmit');
		if (fileSubmit === null) {
			return;
		} else {
			fileSubmit.addEventListener('click', event => {
				if (fileInput.files.length > 5) {
					event.preventDefault();
					event.stopPropagation();
					alert('Number of files must not exceed 5');
				}
				return;
			});
		}
	};

	maxFileNumber();
	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function (form) {
		form.addEventListener(
			'submit',
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();
