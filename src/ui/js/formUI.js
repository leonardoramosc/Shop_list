/*
 ESTE MODULO SE ENCARGARA DE TODO LO RELACIONADO CON LA INTERFAZ DE USUARIO
*/
const { remote } = require('electron');
const main = remote.require('./main.js');


const inputs =  {
	name  : document.getElementById('name'),
	price :  document.getElementById('price'),
	desc  : document.getElementById('description') 
}

let editing = {status:false};

const getInputs = () => {
	const form = document.getElementById('form');
	
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const newProduct = {
			name  : inputs.name.value,
			price : inputs.price.value,
			description  : inputs.desc.value
		};
		if(editing.status){
			newProduct.id = editing.id;
			getNewProduct('update', newProduct);
			editing.status = false;
		} else {
			getNewProduct('create', newProduct);
		}
	})

}

const getNewProduct = async (action, product) => {
		
	await saveProduct(action, product);
	
	form.reset();
	inputs.name.focus();

	await getProducts();

}

const saveProduct = async (action, product) => {
	if(action === 'create'){
		try{
			await main.createProduct(product);
		} catch(err) {
			console.log(err);
		}
	} else if(action === 'update') {
		try {
			await main.updateProduct(product.name, product.price, product.description, product.id);
		} catch(err){
			console.log(err);
		}
	} else {
		throw new Error('Must provide a valid action');
	}
}

const getProducts = async () => {
	const products = await main.getProducts();
	renderProducts(products);
}

const renderProducts = async (products) => {
	const productList = document.getElementById('products');
	productList.innerHTML = '';

	products.forEach((product) => {
		
		const markup = `
			<div class="card card-body my-2 animate__animated animate__fadeInLeft">
				<h4>${product.name}</h4>
				<p>${product.description}</p>
				<h3>${product.price}</h3>
				<p>
				  <button class="btn btn-danger" onclick="deleteProduct(${product.id})">DELETE</button>
				  <button class="btn btn-secondary" 
				  	onclick="updateProduct({
				  		name       :'${product.name}',
				  		price      : ${product.price},
				  		description:'${product.description}',
				  		id         : ${product.id}

				  	})">
				  		EDIT
				  </button>
				</p>
			</div>
		`;
		productList.insertAdjacentHTML('beforeend', markup);
	});
}

const updateProduct = async (product) => {
	editing.status = true;
	editing.id = product.id;
	inputs.name.value = product.name;
	inputs.price.value = product.price;
	inputs.desc.value = product.description;

	inputs.name.focus();
}

const deleteProduct = async (id) => {
	await main.deleteProduct(id);
	await getProducts();
};


const init = async () => {
	await getProducts();
	
	await getInputs();
}

init();
