import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import Button from '../../../Components/Button/Button'
import { getProduct, putProduct } from '../../../Utils/ProductUtils'
import { getStoresList } from '../../../Utils/StoreUtils'
import './ProductView.css'
import notImage from '../../../Assets/image-not-found.png'
import Timer from '../../../Utils/Timer'

const ProductView = () => {
  const navegate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState([])
  const [stores, setStores] = useState([])
  const [store, setStore] = useState([])
  const [gallery, setGallery] = useState([])
  let [contador, setContador] = useState(1)

  const nombre = useRef('')
  const categoria = useRef('')
  const precio = useRef('')
  const descripcion = useRef('')
  const tienda = useRef('')
  const imagen = useRef('')
  const galeria = useRef('')

  const { id } = useParams()
  useEffect(async () => {
    setLoading(true)
    let producto = await getProduct(id)
    let tiendas = await getStoresList()
    setTimeout(setLoading(false), 1000)

    setProduct(producto)
    setStore(tiendas.find((t) => t._id === producto.store))
    setStores(tiendas)
    setGallery(producto.gallery)
    setContador(producto.stock || 0)
    nombre.current.value = producto.title || ''
    precio.current.value = producto.price || 0
    descripcion.current.value = producto.description || ''
    tienda.current.value = producto.store || ''
    categoria.current.value = producto.category || ''
    imagen.current.value = producto.image || ''
  }, [])

  const addGalleryItem = (e) => {
    e.preventDefault()
    if (galeria.current.value !== '' && e.key == 'Enter') {
      setGallery([...gallery, galeria.current.value])
      galeria.current.value = ''
    }
  }

  const deleteGalleryItem = (item) => {
    setGallery(gallery.filter((e) => e != item))
  }

  const sendForm = (e) => {
    e.preventDefault()
    let productoEdit = {
      _id: product._id,
      title: nombre.current.value,
      price: precio.current.value,
      stock: contador,
      description: descripcion.current.value,
      image: imagen.current.value,
      category: categoria.current.value,
      store: tienda.current.value,
      gallery: gallery,
      mostWanted: false,
    }
    putProduct(product._id, productoEdit)
      .then(navegate('/products'))
      .catch((err) => console.error('Error santanderístico al cargar el producto'))
  }

  const prevenirEnvio = (e) => {
    if (e.key == 'Enter') {
      e.preventDefault(e)
    }
  }

  const handleResta = () => {
    contador--
    setContador(contador)
  }
  const handleSuma = () => {
    contador++
    setContador(contador)
  }

  return (
    <Timer loading={loading}>
      <div className="product colorPrincipal">
        <div className="product-img">
          <img src={product.image ? product.image : notImage} alt={product.title} />
        </div>
        <div>
          <h3>{product.title}</h3>
          <div className="product-info">
            <p className="puntos">
              {product.price}
              <span>Puntos superclub</span>
            </p>
            <p className="puntos">
              {product.stock}
              <span>Stock superclub</span>
            </p>
            <div className="tienda">
              {product.store && store ? (
                <>
                  <img src={store.logo ? store.logo : notImage} alt="" />
                  <span>{store.name}</span>
                </>
              ) : (
                <>
                  <img src={notImage} alt="not image" />
                  <span>El producto no tiene tienda</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="form-container colorPrincipal">
        <h3>Información</h3>
        <form onSubmit={sendForm}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <br />
            <input className="colorBuscadores" required type="text" ref={nombre} id="nombre" />
          </div>
          <div className="input-group">
            <label htmlFor="categoria">Categoria</label>
            <br />
            <input className="colorBuscadores" required type="text" ref={categoria} id="categoria" />
          </div>
          <div className="input-group">
            <label htmlFor="precio">Precio</label>
            <br />
            <input className="colorBuscadores" required type="number" ref={precio} id="precio" />
          </div>
          <p>Stock</p>
          <br />
          <div className="contador colorBuscadores">
            <button type="button" onClick={handleResta} className="operador colorBuscadores">
              -
            </button>
            <input className="colorBuscadores" id="stock" value={contador} name="stock" type="number" defaultValue="1" required></input>
            <button type="button" onMouseDown={handleSuma} className="operador colorBuscadores">
              +
            </button>
          </div>
          <div className="input-group">
            <label htmlFor="descripcion">Descripcion</label>
            <br />
            <textarea className="colorBuscadores" ref={descripcion} id="descripcion" cols="30" rows="10"></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="tienda">Tienda</label>
            <br />

            <select className="colorBuscadores" ref={tienda} id="tienda">
              <option value="0" disabled>
                -- Seleccione una tienda --
              </option>
              {stores &&
                stores.map((t) => (
                  <option value={t._id} key={t._id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          <h3>Galería de imagenes</h3>
          <div className="input-group">
            <label htmlFor="image">Imagen principal</label>
            <br />
            <input className="colorBuscadores" type="url" ref={imagen} id="image" placeholder="Url de imagen..." />
          </div>
          <div className="input-group">
            <label htmlFor="image">Nueva imagen</label>
            <br />
            <input
              className="colorBuscadores"
              type="url"
              ref={galeria}
              id="image"
              placeholder="Url de imagen..."
              onKeyUp={addGalleryItem}
              onKeyPress={prevenirEnvio}
            />

            {product &&
              gallery &&
              gallery.map((item, i) => {
                return (
                  <div className="product-galleryItem colorItems" key={i}>
                    <div className="product-galleryItem-img">
                      <div className="product-img">
                        <img src={item} alt={item} />
                      </div>
                      <p>{item}</p>
                    </div>
                    <Button type="button" text="Quitar" callback={() => deleteGalleryItem(item)} />
                  </div>
                )
              })}
          </div>
          <div className="actions">
            <Button
              type="button"
              text="Cancelar"
              callback={() => {
                navegate('/products')
              }}
            />
            <Button text="Guardar" callback={() => {}} />
          </div>
        </form>
      </div>
    </Timer>
  )
}

export default ProductView
