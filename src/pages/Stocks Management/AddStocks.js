import React, { useContext, useEffect, useState } from "react";
import SignContext from "../../contextAPI/Context/SignContext";
import { Col, Form, Input, Label, Row } from "reactstrap";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_URL;


const AddStocks = ({ refreshTable, StockForUpdate, setStockForUpdate }) => {
  const { getProducts } = useContext(SignContext);
  const [Product, setProduct] = useState([]);

  const [stocks, setStocks] = useState([]); // State to hold stocks

  const handleSavedStocks = async (values) => {
    try {
      let res;
    
      if (StockForUpdate) {
        res = await axios.put(`${baseUrl}/stocks/updatestock/${StockForUpdate._id}`, values);
        if (res.data && res.data.success) {
          setStocks(stocks.map(stock => stock._id === StockForUpdate._id ? res.data.updatedStock : stock));
          refreshTable();
        }
        console.log("whats the 1 ",res);
      } else {
        res = await axios.post(`${baseUrl}/stocks/createstock`, values);
        if (res.data && res.data.success) {
          setStocks([...stocks, res.data.newStock]);
          refreshTable();
        }
        console.log("whats the 2 ",res);
      }

      if (res) {
        console.log("Stock operation successful:", res);
        setStockForUpdate(null);
        fetchData();
        refreshTable();

      } else {
        console.error("Error in stock operation:", res.data && res.data.error ? res.data.error : "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/stocks/getstocks`);
      setProduct(res.data.products);
      setStocks(res.data.stocks); // Assuming the API returns stocks here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Getproducts = async () => {
    try {
      const res = await getProducts();
      setProduct(
        res.products.map((item) => ({
          value: item._id,
          label: item.sku,
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    Getproducts();
    fetchData(); // Fetch stocks on mount
  }, []);

  const validationSchema = Yup.object().shape({
    ProductId: Yup.string().required("Select a product"),
    quantity: Yup.number()
      .typeError("Quantity must be a number")
      .required("Enter the quantity")
      .positive("Quantity must be a positive number"),
    currentPricePerUnit: Yup.number()
      .typeError("Price must be a number")
      .required("Enter the current price")
      .positive("Price must be a positive number"),
    date: Yup.date().required("Select a date"),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ProductId: StockForUpdate?.ProductId || "",
        quantity: StockForUpdate?.quantity || "",
        currentPricePerUnit: StockForUpdate?.currentPricePerUnit || "",
        date: StockForUpdate?.date ? new Date(StockForUpdate.date.split("T")[0]) : null,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        setSubmitting(true);
        await handleSavedStocks(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({
        isSubmitting,
        handleChange,
        handleSubmit,
        values,
        handleBlur,
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Row className="align-items-center g-3">
            <Col lg={4} md={6}>
              <Label className="form-label" htmlFor="category">
                Select product with SKU*
              </Label>
              <Select
                value={Product.find((p) => p.value === values.ProductId)}
                onChange={(selectedOption) => setFieldValue("ProductId", selectedOption?.value)}
                options={Product}
              />
            </Col>
            <Col lg={2}>
              <Label className="form-label" htmlFor="category">
                Add Quantity*
              </Label>
              <Input
                className="form-control"
                name="quantity"
                type="number"
                placeholder="add quantity"
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col lg={2}>
              <Label className="form-label" htmlFor="category">
                Add Current Price*
              </Label>
              <Input
                className="form-control"
                type="number"
                name="currentPricePerUnit"
                placeholder="add current price"
                value={values.currentPricePerUnit}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col lg={2}>
              <Label className="form-label" htmlFor="category">
                Date
              </Label>
              <DatePicker
                className="form-control"
                selected={values.date}
                onChange={(date) => setFieldValue("date", date)}
                placeholderText="Select a date"
              />
            </Col>
            <Col lg={1}>
              <div className="text-center">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary w-sm mt-4"
                >
                  Submit
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AddStocks;
