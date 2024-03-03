//const cart = {};
var cart = []

const cartBody = document.getElementById('cart-body');
var cantidadDeElementos = 0 

const errorImage = (img) => img.src = 'imagenes/productos/img_404.png'; 

const catalogoCategorias = catalogoMatriz.map(elemento => elemento[0]);
const catalogoNombres = catalogoMatriz.map(elemento => elemento[1]);

const botonFP = document.getElementById('boton-FP');

var tablaVisible = false 


function addProduct(producto, categoria) {
    const imageSrc = 'imagenes/productos' + producto[0] + '.png'
    const productName = producto[0] 
    const price = producto[1]
    const category = categoria[1].replace(/ /g, "_")

    

    const productList = document.getElementById('product-list');
               
    const productId = `${category}-${productName.replace(/\s+/g, '-').toLowerCase()}`;
    const existingProduct = document.getElementById(productId);
               
    if (existingProduct) {
        const quantityInput = existingProduct.querySelector('.quantity-input');
        quantityInput.value = String(parseInt(quantityInput.value) + 1);
        //updateCart(productId, quantityInput.value);
        return;
    }

    const productContainer = document.createElement('div');
    productContainer.classList.add('product-container', category);
    productContainer.id = productId;
            
    const productImage = document.createElement('img');
    productImage.classList.add('product-image');
    productImage.src = imageSrc;
    productImage.alt = productName;
    productImage.onerror = () => errorImage(productImage);
            
    const productNameElement = document.createElement('div');
    productNameElement.classList.add('product-name');
    productNameElement.textContent = productName;

    const priceElement = document.createElement('div');
    priceElement.classList.add('product-price');
    priceElement.textContent = categoria[2] ? `$${price.toFixed(2)}` : 'Precio a consultar'; // Formatear el precio
            
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.classList.add('quantity-input');
    quantityInput.value = '1';
    quantityInput.min = '1';
            
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('add-to-cart-button');
    addToCartButton.textContent = '🛒 Añadir ';
    addToCartButton.addEventListener('click', () => addToCart(productId, quantityInput.value, price, categoria[2]));
            

    productContainer.appendChild(productImage);
    productContainer.appendChild(productNameElement);
    productContainer.appendChild(priceElement);
    productContainer.appendChild(quantityInput);
    productContainer.appendChild(addToCartButton);      

    productList.appendChild(productContainer);
}





function addToCart(productId, quantity, price, valorVisible) {
    const product = document.getElementById(productId);
    const productName = product.querySelector('.product-name').textContent;
    

    cart.push([
        productName, // Nombre 
        quantity, // Cantidad 
        (valorVisible ? price.toFixed(2) : 'Consultar') // Valor por unidad
    ]);


    
    const existingCartItem = [...cartBody.children].find(item => item.textContent.includes(productName));
    

    

    if (!existingCartItem) {
        const cartItem = document.createElement('tr');
        const productNameCell = document.createElement('td');
        const quitarCell = document.createElement('td');
        const quantityCell = document.createElement('td');
        const valueCell = document.createElement('td');
        
        quitarCell.classList.add('quitar-column');

        
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-from-cart-button');
        removeButton.textContent = 'quitar';
        removeButton.addEventListener('click', () => removeFromCart(productName));

        quitarCell.appendChild(removeButton);

        productNameCell.textContent = productName;
        quantityCell.textContent = "x"+ parseInt(quantity);
        quantityCell.classList.add('quantity-text');

        valueCell.textContent = valorVisible ? `$${price.toFixed(2)}` : 'Consultar';
        
        cartItem.appendChild(quitarCell);
        cartItem.appendChild(productNameCell);
        cartItem.appendChild(quantityCell);
        cartItem.appendChild(valueCell);
        cartBody.appendChild(cartItem);
        cantidadDeElementos +=1
    } else {
        const quantityCell = existingCartItem.querySelector('td:nth-child(3)');
        quantityCell.textContent = "x"+ parseInt(quantity);
    }
    botonFP.style.display = 'block';
}

function removeFromCart(productName) {
    const cartItem = [...cartBody.children].find(item => item.textContent.includes(productName));
    if (cartItem) {
        cartBody.removeChild(cartItem);
        cantidadDeElementos -=1
    }
    
    if (cantidadDeElementos === 0) {
        botonFP.style.display = 'none';
    }
}

//const updateCart = (productId, quantity) => cart[productId] = parseInt(quantity);


function filterProducts(category) {
    const products = document.querySelectorAll('.product-container');

    products.forEach(product => {
        if (category === 'all' || product.classList.contains(category)) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
}







function agregarBotonCategoria(categoria) {
    const buttonContainer = document.getElementById('category-nav');

    const button = document.createElement('button');
    button.textContent = categoria;
    button.onclick = function () {
        filterProducts(categoria.replace(/ /g, "_"));
    };

    button.style.marginRight = '5px';

    buttonContainer.appendChild(button);
}


const categoria_ToString = (categoria) => catalogoNombres[catalogoCategorias.indexOf(categoria)]




function generarProductosDeCategoria(categoria) {  
    //        categoria = [cat,'nombre', booleano] 
    //        categoria.   [0]    [1]     [2]

    categoria[0].forEach(producto => {
        addProduct(producto, categoria)
    });
}





function colocarCatalogo() {

    catalogoMatriz.forEach(categoria => {
        agregarBotonCategoria(categoria[1]);
        generarProductosDeCategoria(categoria);
    });

}






const volverAlInicio = () => window.location.href = "index.html" 


function finalizarPedido(){ 
    var parametros = "?carrito=" + encodeURIComponent(JSON.stringify(cart));
    window.location.href = "fin_pedido.html" + parametros;
}

function crearEndTable(carrito) {


    const cuerpoTabla = document.getElementById('end-cart-body');

    carrito.forEach(elemento => {
        const fila = document.createElement('tr');
        const celda2 = document.createElement('td');
        const celda3 = document.createElement('td');
        const celda4 = document.createElement('td');

        // Establecer el contenido de cada celda según la estructura del elemento
    

        // Verificar si el elemento es una lista y tiene al menos 3 elementos
        if (Array.isArray(elemento) && elemento.length >= 3) {
            celda2.textContent = elemento[0];
            celda3.textContent = elemento[1];
            celda4.textContent = `$ ${elemento[2]}`;
        } else {
            // Si la estructura del elemento no es la esperada, establecer valores predeterminados
            celda2.textContent = 'Producto';
            celda3.textContent = 'Cant.';
            celda4.textContent = '$/unidad';
        }


        fila.appendChild(celda2);
        fila.appendChild(celda3);
        fila.appendChild(celda4);

        cuerpoTabla.appendChild(fila);
    });
}

function mostrarPedido() {
    var urlParams = new URLSearchParams(window.location.search);
    var carritoParam = urlParams.get('carrito');
    var cart = JSON.parse(decodeURIComponent(carritoParam));

    const tabla = document.getElementById('end-cart-table');
    const cuerpoTabla = document.getElementById('end-cart-body');

    const tablaNoCreada = () => cuerpoTabla.rows.length === 0;

    if (tablaVisible) {
        tabla.style.display = 'none';
        tablaVisible = false;
    } else {
        if (tablaNoCreada()) {
            crearEndTable(cart);
        }
        tabla.style.display = 'block';
        tablaVisible = true;
    }
}




function pedidoFormateado() {
    var urlParams = new URLSearchParams(window.location.search);
    var carritoParam = urlParams.get('carrito');
    var pedido = JSON.parse(decodeURIComponent(carritoParam));



    return  `
    PRODUCTO | CANTIDAD | VALOR \n
    ${JSON.stringify(pedido)
        .replace(/],/g, ']\n ')
        .replace(/,/g, ' | ')
        .replace(/"/g, '')
        .replace("[", '')
            
    }
    `
}

document.getElementById("pedido_field").value = pedidoFormateado();


document.getElementById("nro_pedido").value = new Date().getTime();







