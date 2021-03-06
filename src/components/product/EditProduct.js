import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {Button, Icon, message, Upload, Spin, Alert} from 'antd';
import {TextField, TextAreaField, NumberField} from 'redux-form-antd';

import AuthService from '../../helpers/auth_service';
import {fetchProduct, editProduct, setMenuItem} from "../../actions";
import {NECESSARY_FIELD} from "../../helpers/constants";
import '../common/form.css';
import NoAuthAlert from "../common/NoAuthAlert";

class ProductEdit extends Component {
    state = {
        isLoggedIn: AuthService.isLogged(),
        productId: this.props.match.params.id,
        imageFile: [],
        loaded: false,
        sent: false
    };

    componentDidMount() {
        this.props.setMenuItem('-');
        if (this.state.isLoggedIn)
            this.props.fetchProduct(this.state.productId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {product} = this.props;
        if (!this.state.loaded && product.id && !product.isError && !product.isLoading) {
            this.setState({loaded: true});
            this.props.initialize({
                name: product.name,
                description: product.description,
                protein: product.protein,
                carbohydrate: product.carbohydrate,
                fat: product.fat,
                fibre: product.fibre,
                kcal: product.kcal
            });
        }
        if (this.state.sent && product.isLoading)
            message.loading("Zapisywanie w toku", 0.7);
        else if (this.state.sent && product.isError)
            message.error("Coś poszło nie tak");
        else if (this.state.sent && !product.isLoading && !product.isError) {
            message.success('Poprawnie edytowano produkt');
            this.props.history.push(`/products/${this.state.productId}`);
        }
    }

    onSubmit = (values) => {
        values.image = this.state.imageFile[0];
        this.props.editProduct(this.state.productId, values);
        this.setState({sent: true});
    };

    render() {
        if (!this.state.isLoggedIn)
            return <NoAuthAlert/>;
        if (this.props.product.isError)
            return <Alert
                message="Błąd"
                style={{width: '80%', marginTop: '1%'}}
                description="Niestety nie udało nam się znaleźć tego produktu."
                type="error"
                showIcon
            />;

        return (
            <div className='form-container'>
                <div className='form-container__wrapper'>
                    <h1 className='form-container__title'><label>Edytuj produkt</label></h1>
                    <Spin tip='Ładowanie' spinning={this.props.product.isLoading}>
                        <form onSubmit={this.props.handleSubmit(this.onSubmit)} className='form' autoComplete='off'>
                            <Field
                                name='name'
                                component={TextField}
                                addonBefore={<label>Nazwa</label>}
                                placeholder='Nazwa'/>
                            <Field
                                name='description'
                                rows={4}
                                component={TextAreaField}
                                placeholder='Opis'/>
                            <Upload
                                name='image'
                                className='form__upload-btn'
                                action={(image) => {
                                    this.setState({imageFile: [image]});
                                    this.event.preventDefault();
                                }}
                                onRemove={() => this.setState({imageFile: []})}
                                fileList={this.state.imageFile}
                                showUploadList={true}
                                accept='.jpg, .jpeg, .png' supportServerRender={true}>
                                <Button htmlType='button'>
                                    <Icon type="upload"/> Wczytaj zdjęcie
                                </Button>
                            </Upload>

                            <div>
                                <label>Makroskładniki oraz pozostałe informacje w <b>100g</b> produktu</label>
                                <Field
                                    name='protein'
                                    component={NumberField}
                                    step={0.1}
                                    label='Białko'/>
                                <Field
                                    name='carbohydrate'
                                    component={NumberField}
                                    step={0.1}
                                    label='Węglowodany'/>
                                <Field
                                    name='fat'
                                    component={NumberField}
                                    step={0.1}
                                    label='Tłuszcz'/>
                                <Field
                                    name='fibre'
                                    component={NumberField}
                                    step={0.1}
                                    label='Błonnik'/>
                                <Field
                                    name='kcal'
                                    component={NumberField}
                                    step={1}
                                    label='Kalorie'/>
                            </div>
                            <Button className='form__button' type="primary" ghost htmlType='submit'>Zatwierdź</Button>
                        </form>
                    </Spin>
                </div>
            </div>
        )
    }

}

function validate({name, description, protein, carbohydrate, fat, fibre, kcal}) {
    const errors = {};

    if (!name || !name.trim())
        errors.name = NECESSARY_FIELD;
    else if (name.length < 2 || name.length > 60)
        errors.name = 'Nazwa musi mieć więcej niż 2 znaki, a mniej niż 60 znaków';

    if (!description || !description.trim())
        errors.description = NECESSARY_FIELD;
    else if (description.length < 10 || description.length > 3000)
        errors.description = "Opis może zawierać od 10 do 3000 znaków";

    if (!protein && protein !== 0)
        errors.protein = NECESSARY_FIELD;
    else if (protein < 0)
        errors.protein = 'Wartość białka nie może być ujemna';
    else if (protein > 100)
        errors.protein = 'Wartość białka nie może być większa niż 100';
    else if (isNaN(protein))
        errors.protein = "Wartość białka musi wyrażać się liczbą";

    if (!carbohydrate && carbohydrate !== 0)
        errors.carbohydrate = NECESSARY_FIELD;
    else if (carbohydrate < 0)
        errors.carbohydrate = 'Wartość węglowodanów nie może być ujemna';
    else if (carbohydrate > 100)
        errors.carbohydrate = 'Wartość węglowodanów nie może być większa niż 100';
    else if (isNaN(carbohydrate))
        errors.carbohydrate = "Wartość węglowodanów musi wyrażać się liczbą";

    if (!fat && fat !== 0)
        errors.fat = NECESSARY_FIELD;
    else if (fat < 0)
        errors.fat = 'Wartość tłuszczu nie może być ujemna';
    else if (fat > 100)
        errors.fat = 'Wartość tłuszczu nie może być większa niż 100';
    else if (isNaN(fat))
        errors.fat = "Wartość tłuszczu musi wyrażać się liczbą";

    if (!fibre && fibre !== 0)
        errors.fibre = NECESSARY_FIELD;
    else if (fibre < 0)
        errors.fibre = 'Wartość błonnika nie może być ujemna';
    else if (fibre > 100)
        errors.fibre = 'Wartość błonnika nie może być większa niż 100';
    else if (isNaN(fibre))
        errors.fibre = "Wartość błonnika musi wyrażać się liczbą";

    if (!kcal && kcal !== 0)
        errors.kcal = NECESSARY_FIELD;
    else if (kcal < 0)
        errors.kcal = 'Produkt nie może mieć mniej niż 0 kalorii';
    else if (kcal > 1000)
        errors.kcal = 'Wartość kalorii nie może być większa niż 1000';
    else if (isNaN(kcal))
        errors.kcal = "Wartość kalorii musi wyrażać się liczbą";

    return errors;
}

const mapStateToProps = ({products}) => {
    return {product: products.selectedProduct,}
};

const formWrapped = reduxForm({
    validate,
    form: 'EditProductForm'
})(ProductEdit);

export default connect(mapStateToProps, {editProduct, fetchProduct, setMenuItem})(formWrapped);