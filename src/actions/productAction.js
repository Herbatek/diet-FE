import AuthService from "../helpers/auth_service";
import SecuredRequest from "../helpers/secured_request";
import Request from "../helpers/request";
import {
    CREATE_PRODUCT,
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
    DELETE_PRODUCT,
    FETCH_MY_PRODUCTS,
    SEARCH_PRODUCTS,
    FETCH_PRODUCTS_INFINITY,
    SEARCH_PRODUCTS_INFINITY,
    EDIT_PRODUCT
} from "./index";

export function createProduct(product, callback) {
    const userId = AuthService.getDecodedToken().sub;
    const token = AuthService.getToken();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("imageToSave", product.image);
    formData.append("protein", product.protein);
    formData.append("carbohydrate", product.carbohydrate);
    formData.append("fat", product.fat);
    formData.append("fibre", product.fibre);
    formData.append("kcal", product.kcal);

    const request = SecuredRequest.post(`/users/${userId}/products`, formData, {headers: {'Authorization': `Bearer ${token}`}})
        .then(() => callback());

    return {
        type: CREATE_PRODUCT,
        payload: request
    }
}

export function fetchProduct(id, onErrorDo) {
    const request = Request.get(`/products/${id}`)
        .catch(e => onErrorDo());

    return {
        type: FETCH_PRODUCT,
        payload: request
    }
}

export function deleteProduct(id, callback) {
    const token = AuthService.getToken();
    SecuredRequest.delete(`/products/${id}`, {headers: {'Authorization': `Bearer ${token}`}})
        .then(() => callback());

    return {
        type: DELETE_PRODUCT,
        payload: id
    }
}

export function fetchProducts(page, pageSize) {
    const request = Request.get(`/products?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_PRODUCTS,
        payload: request
    }
}

export function fetchProductsInfinity(page, pageSize) {
    const request = Request.get(`/products?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_PRODUCTS_INFINITY,
        payload: request
    }
}

export function fetchMyProducts(page, pageSize) {
    const userId = AuthService.getDecodedToken().sub;
    const request = Request.get(`/users/${userId}/products?page=${page}&size=${pageSize}`);

    return {
        type: FETCH_MY_PRODUCTS,
        payload: request
    }
}

export function searchProducts(query, page, pageSize) {
    const request = Request.get(`/products/search?query=${query}&page=${page}&size=${pageSize}`);

    return {
        type: SEARCH_PRODUCTS,
        payload: request
    }
}

export function searchProductsInfinity(query, page, pageSize) {
    const request = Request.get(`/products/search?query=${query}&page=${page}&size=${pageSize}`);

    return {
        type: SEARCH_PRODUCTS_INFINITY,
        payload: request
    }
}

export function editProduct(productId, update, callback) {
    const token = AuthService.getToken();

    const formData = new FormData();
    formData.append("name", update.name);
    formData.append("description", update.description);
    if (update.image instanceof File)
        formData.append("imageToSave", update.image);
    formData.append("protein", update.protein);
    formData.append("carbohydrate", update.carbohydrate);
    formData.append("fat", update.fat);
    formData.append("fibre", update.fibre);
    formData.append("kcal", update.kcal);

    const request = SecuredRequest.put(`/products/${productId}`, formData, {headers: {'Authorization': `Bearer ${token}`}})
        .then((response) => {
            callback();
            return response;
        });

    return {
        type: EDIT_PRODUCT,
        payload: request
    }
}