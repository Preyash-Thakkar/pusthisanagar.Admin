import React, { useEffect, useContext, useState } from "react";
import { Col, Label, Row, Input } from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  getColor,
  getMaterial,
  getSeason,
  getSize,
} from "../../helpers/backend_helper";
import SignContext from "../../contextAPI/Context/SignContext";

import {
  GET_COLOR,
  GET_MATERIAL,
  GET_SEASON,
  GET_SIZE,
} from "../../store/product/actionTypes";

const Filters = (props) => {
  const colorsData = useSelector((state) => state.Product.colors);
  const seasonsData = useSelector((state) => state.Product.seasons);
  const materialsData = useSelector((state) => state.Product.materials);
  const sizesData = useSelector((state) => state.Product.sizes);
  console.log("aasized", sizesData);

  // const { Getsize, DeleteSize, AddSize } = useContext(SignContext);
  // const [sizeData,setSizeData] = useState([]);

  const dispatch = useDispatch();

  const fetchDropdownData = async () => {
    try {
      const colorRes = await getColor();
      dispatch({
        type: GET_COLOR,
        payload: {
          actionType: "GET_COLOR",
          data: colorRes.colors,
        },
      });
      const seasonRes = await getSeason();
      dispatch({
        type: GET_SEASON,
        payload: {
          actionType: "GET_SEASON",
          data: seasonRes.season,
        },
      });

      const sizeRes = await getSize();
      dispatch({
        type: GET_SIZE,
        payload: {
          actionType: "GET_SIZE",
          data: sizeRes.sizes,
        },
      });

      const materialRes = await getMaterial();
      dispatch({
        type: GET_MATERIAL,
        payload: {
          actionType: "GET_MATERIAL",
          data: materialRes.material,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (selectedMulti2) => {
    props.setselectedFilters(selectedMulti2);
    props.setselectedItems(selectedMulti2.map((i) => i.value));
  };
  console.log(props, "____________props");

  useEffect(() => {
    console.log(props, "____________props");
    if (
      colorsData.length === 0 ||
      seasonsData.length === 0 ||
      materialsData === 0 ||
      sizesData === 0
    ) {
      fetchDropdownData();
    }

    console.log("My size data", sizesData);
  }, [props.selectedItems]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={4}>
          <div className="mb-3">
            <label
              htmlFor="choices-multiple-remove-button"
              className="form-label"
            >
              filter by
            </label>
            <Select
              value={props.selectedFilters}
              isMulti={true}
              isClearable={true}
              onChange={(selectedMulti2) => {
                handleFilterChange(selectedMulti2);
              }}
              options={[
                { value: "Color", label: "Color" },
                { value: "Material", label: "Material" },
                { value: "Season", label: "Season" },
                { value: "productSize", label: "product size" },
              ]}
            />
          </div>
        </Col>

        {props.selectedItems.includes("Color") ? (
          <Col sm={2}>
            <div className="mb-3">
              <label className="form-label" htmlFor="color">
                Color
              </label>
              <select
                className="form-select"
                id="color"
                name="color"
                aria-label="color"
                value={props.selectedcolors || ""}
                onChange={(e) => {
                  props.setSelectedcolors(e.target.value);
                }}
              >
                <option value={null}>Select color</option>
                {colorsData
                  ? colorsData.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  : null}
              </select>
              {/* Error handling code here */}
            </div>
          </Col>
        ) : null}

        {props.selectedItems.includes("Material") ? (
          <Col sm={2}>
            <div className="mb-3">
              <label className="form-label" htmlFor="material">
                Material
              </label>
              <select
                className="form-select"
                id="material"
                name="material"
                aria-label="material"
                value={props.selectedmaterials || ""}
                onChange={(e) => {
                  props.setSelectedmaterials(e.target.value);
                }}
              >
                <option value={null}>Select material</option>
                {materialsData
                  ? materialsData.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  : null}
              </select>
              {/* Error handling code here */}
            </div>
          </Col>
        ) : null}

        {props.selectedItems.includes("Season") ? (
          <Col sm={2}>
            <div className="mb-3">
              <label className="form-label" htmlFor="season">
                Season
              </label>
              <select
                className="form-select"
                id="season"
                name="season"
                value={props.selectedseasons || ""}
                aria-label="season"
                onChange={(e) => {
                  props.setSelectedseasons(e.target.value);
                }}
              >
                <option value={null}>Select season</option>
                {seasonsData
                  ? seasonsData.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  : null}
              </select>
              {/* Error handling code here */}
            </div>
          </Col>
        ) : null}

        {props.selectedItems.includes("productSize") ? (
          <Col sm={2}>
            <div className="mb-3">
              <label className="form-label" htmlFor="size">
                product size in CM
              </label>
              <select
                className="form-select"
                id="size"
                name="size"
                value={props.selectedSize || ''}
                aria-label="size"
                onChange={(e) => {
                  props.setSelectedSize(e.target.value);
                }}
              >
                <option value={null}>Select size</option>
                {sizesData
                  ? sizesData.map((category) => (
                      <option key={category._id} value={category.size}>
                        {category.size}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          </Col>
        ) : null}
      </Row>
    </React.Fragment>
  );
};

export default Filters;
