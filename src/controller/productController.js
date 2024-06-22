import { productServices } from "../services/productServices.js";
import { userServices } from "../services/userServices.js";
import { transport } from "../utils/transportEmail.js";


const US = new userServices()
const PS = new productServices()

export class productController {

    controllerCreateProduct = async (req, res) => {
        try {
            const user = await US.getUserDto(req.session.user)
            const owner = user.email
            const { title, description, price, stock } = req.body
            const thumbnail = req.file.filename
            const result = await PS.createProduct(
                owner,
                title,
                description,
                price,
                thumbnail,
                stock
            )
            if(!result) throw 'Error al crear producto'
            res.status(201).redirect('/home')
        } catch(err) {
            req.flash('failMessage', err.message)
            res.status(401).redirect('/profile')
        }
    }

    controllerDeleteProduct = async (req, res) => {
        try {
            const {code} = req.body
            const Uid = req.session.user

            const product = await PS.getProductByCode(code)

            if(product.owner != 'admin' ){
                await transport.sendMail({
                    from: '<no-reply@PF.com>',
                    to: product.owner,
                    subject: 'Eliminacion de Producto',
                    html:`
                        <div>
                            <h1>Eliminacion del producto</h1>
                            <h3>Se le informa que un producto creado por usted ha sido eliminado por un administrador</h3>

                            <p> Informacion de Producto: </p>
                            
                            <p> <strong> Nombre:</strong> ${product.title} </p>
                            <p> <strong> Descripcion:</strong> ${product.description} </p>
                            <p> <strong> Precio:</strong> ${product.price} </p>
                            <p> <strong> Codigo:</strong> ${product.code} </p>

                        </div>
                    `
                })
            }

            const result = await PS.deleteProduct(
                code, 
                Uid
            ) 
            if(!result) throw 'Error al eliminar el producto'
            res.status(204).redirect('/home')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(401).redirect('/profile')
        }
    }
    
    controllerUpdateProduct = async (req, res) => {
        try {
            const {code, title, description, price, stock} = req.body
            const thumbnail = req.file.filename

            const product = {};
            if (title) product.title = title;
            if (description) product.description = description;
            if (price) product.price = price;
            if (thumbnail) product.thumbnail = thumbnail;
            if (stock) product.stock = stock;
            
            const result = await PS.updateProduct(
                code,
                product
            )
            if(!result) throw 'Error al eliminar el producto'
            res.status(200).redirect('/profile')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(401).redirect('/profile')
        }

    }

}
