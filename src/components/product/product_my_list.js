import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {Pagination, Layout, Collapse} from 'antd';

import {fetchMyProducts} from "../../actions";
import Header from "../default/header";
import Footer from '../default/footer';
import AuthService from "../../helpers/auth_service";
import {NO_LOGIN_MESSAGE} from "../../helpers/messages";

class ProductMyList extends Component {
    componentDidMount() {
        if (AuthService.isLogged())
            this.props.fetchMyProducts(0)
    }

    renderProducts = () => {
        const {Panel} = Collapse;
        const {content, currentPage, totalElements} = this.props.products;

        return (
            <div className='content'>
                <Collapse className='collapse'>
                    {
                        _.map(content, (product) => {
                            const header = (
                                <div>
                                    <h3>{product.name}</h3> <Link to={`/products/${product.id}`}> More</Link>
                                </div>
                            );
                            return (
                                <Panel className='collapse__item' key={product.id} header={header}>
                                    <p>Description: {product.description}</p>
                                    <p>Calories: {product.kcal}</p>
                                    <img src={product.imageUrl} alt='product'/>
                                </Panel>
                            );
                        })
                    }
                </Collapse>,
                <Pagination current={currentPage + 1} total={totalElements} onChange={this.onChange}/>
            </div>
        )
    };

    onChange = (page) => {
        this.props.fetchMyProducts(page - 1);
    };

    render() {
        return (
            <Layout>
                <Header menuSelectedItem='product-my-list'/>

                {AuthService.isLogged() ? this.renderProducts() : NO_LOGIN_MESSAGE}

                <Footer/>
            </Layout>
        );
    }
}

const mapStateToProps = ({products}) => {
    return {
        products
    }
};

export default connect(mapStateToProps, {fetchMyProducts})(ProductMyList);