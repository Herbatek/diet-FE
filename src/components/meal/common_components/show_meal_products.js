import React, {Component} from 'react';
import _ from "lodash";
import {Tag} from "antd";
import {Link} from "react-router-dom";


class ShowMealProducts extends Component {
    render() {

        const {products} = this.props;

        return (
            <div>
                <h2>Products</h2>
                {_.map(products, product =>
                    <Tag key={product.id} style={{marginBottom: '5px'}} >
                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                    </Tag>
                )}
            </div>
        )
    }
}

export default ShowMealProducts;