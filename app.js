	$('.edit-btn').prop('disabled', true);
	$('.delete-btn').prop('disabled', true);
	// Example starter JavaScript for disabling form submissions if there are invalid fields
	(function() {
		'use strict';
		window.addEventListener('load', function() {
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			var forms = document.getElementsByClassName('needs-validation');
			// Loop over them and prevent submission
			var validation = Array.prototype.filter.call(forms, function(form) {
				form.addEventListener('submit', function(event) {
					if (form.checkValidity() === false) {
						event.preventDefault();
						event.stopPropagation();
					}
					form.classList.add('was-validated');
				}, false);
			});
		}, false);
	})();

	//Create Data
	const thisForm = document.getElementById('myForm');
	thisForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		const formData = new FormData(thisForm).entries()
		const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			}, 
			body: JSON.stringify(Object.fromEntries(formData))
		});

		const result = await response.json();
		console.log(result);
		$('#createModal').modal('hide');
		$('.toast').toast('show')
		//location.reload();
	}); 

	//Update
	const thiseditForm = document.getElementById('myeditForm');
	thiseditForm.addEventListener('submit', async function (e) {
		e.preventDefault();
		const formData = new FormData(thiseditForm).entries()
		var $row = $('#getselectedids').html();
		const response = await fetch('https://jsonplaceholder.typicode.com/posts/'+ $row  +'', {
		method: 'PUT',
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		}, 
		body: JSON.stringify(Object.fromEntries(formData))
		});
		const updateresult = await response.json();
		console.log(updateresult);
		$('#editModal').modal('hide');
		$('.toast').toast('show')
		// location.reload();
	}); 

	//Checked Data
	function checkdataitem(){
		var values = new Array();
		$.each($("input[name='checkBox[]']:checked").closest("td").next("td"), function () {
			values.push($(this).text());
		});
		document.getElementById("getselectedids").innerHTML =  values.join("\n") ;
		
		if(values.length > 0){
			$('.delete-btn').prop('disabled', false);
			if(values.length == '1'){
				$('.edit-btn').prop('disabled', false);
			}else{
				$('.edit-btn').prop('disabled', true);
			}
		}
		//fetch data for edit
		var $row = $('#getselectedids').html(); 
		const api_url =  'https://jsonplaceholder.typicode.com/posts/'+ $row +''; 
		// Defining async function 
		async function editapi(url) { 
			// Storing response 
			const response = await fetch(url); 
			// fetching data in form of JSON 
			var data = await response.json(); 
			console.log(data.id);  
			$(".editid").val(data.id); 
			$(".edituserid").val(data.userId); 
			$(".edittitle").val(data.title);
			$(".editbody").val(data.body);
		} 
		// Calling that async function 
		editapi(api_url); 
	}

	//fetching all data
	const api_url =  
	"https://jsonplaceholder.typicode.com/posts"; 
	// Defining async function 
	async function getapi(url) { 
		// Storing response 
		const response = await fetch(url); 
		// Storing data in form of JSON 
		var data = await response.json(); 
		console.log(data); 
		if (response) { 
			hideloader(); 
		} 
		show(data); 
	} 
	// Calling that async function 
	getapi(api_url); 

	// Function to hide the loader 
	function hideloader() { 
		document.getElementById('loading').style.display = 'none'; 
	} 

	// Function to define innerHTML for HTML table 
	function show(data) { 

		var tableContent = "";
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><input value='+this.id+' type="checkbox" class="chk-'+ this.id +' checkBox select" name="checkBox[]" onclick="checkdataitem();" /></td>';
			tableContent += '<td>'+ this.id +'</td>';
			tableContent += '<td>'+ this.userId +'</td>';
			tableContent += '<td>'+ this.title +'</td>';
			tableContent += '<td>'+ this.body +'</td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#pager').append(tableContent);

		// Instantiate pagination after data is available    
		pager = new Pager('pager', 10);
		pager.init();
		pager.showPageNav('pager', 'pageNavPosition');
		pager.showPage(1);

		// pagination object codes.
		function Pager(tableName, itemsPerPage) {
			this.tableName = tableName;
			this.itemsPerPage = itemsPerPage;
			this.currentPage = 1;
			this.pages = 0;
			this.inited = false;

			this.showRecords = function (from, to) {
				var rows = document.getElementById(tableName).rows;
				// i starts from 1 to skip table header row
				for (var i = 1; i < rows.length; i++) {
					if (i < from || i > to) rows[i].style.display = 'none';
					else rows[i].style.display = '';
				}
			}

			this.showPage = function (pageNumber) {
				if (!this.inited) {
					alert("not inited");
					return;
				}

				var oldPageAnchor = document.getElementById('pg' + this.currentPage);
				oldPageAnchor.className = 'pg-normal';

				this.currentPage = pageNumber;
				var newPageAnchor = document.getElementById('pg' + this.currentPage);
				newPageAnchor.className = 'pg-selected';

				var from = (pageNumber - 1) * itemsPerPage + 1;
				var to = from + itemsPerPage - 1;
				this.showRecords(from, to);
			}

			this.prev = function () {
				if (this.currentPage > 1) this.showPage(this.currentPage - 1);
			}

			this.next = function () {
				if (this.currentPage < this.pages) {
					this.showPage(this.currentPage + 1);
				}
			}

			this.init = function () {
				var rows = document.getElementById(tableName).rows;
				var records = (rows.length - 1);
				this.pages = Math.ceil(records / itemsPerPage);
				this.inited = true;
			}

			this.showPageNav = function (pagerName, positionId) {
				if (!this.inited) {
					alert("not inited");
					return;
				}
				var element = document.getElementById(positionId);
				var pagerHtml = '<span onclick="' + pagerName + '.prev();" class="pg-normal"> &#171 Prev </span> | ';
				for (var page = 1; page <= this.pages; page++)
				pagerHtml += '<span id="pg' + page + '" class="pg-normal" onclick="' + pagerName + '.showPage(' + page + ');">' + page + '</span> | ';
				pagerHtml += '<span onclick="' + pagerName + '.next();" class="pg-normal"> Next &#187;</span>';
				element.innerHTML = pagerHtml;
			}
		}

	}
	
	function deleteRow() {
		// Since we don't have multiple delete api, deleting one by one using Promises
		let delData = []
			document.querySelectorAll('#pager .select:checked').forEach(e => {
				e.parentNode.parentNode.remove() // Delete DOM locally for UI purpose 'not in realtime'
				let del = new Promise( (resolve, reject) => {
					fetch(`https://jsonplaceholder.typicode.com/posts/${e.value}`, {
						method: 'POST',
					}).then( response => resolve(true) ).catch( err => reject(false) )
				})
			delData.push(del)
		})

		Promise.all(delData).then( (resolve, reject) => {
			if(resolve){
				$('.toast').toast('show')
			}
		})
	  }
