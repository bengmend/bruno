import React, { useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { uuid } from "utils/common";
import Modal from "components/Modal";
import { useDispatch } from "react-redux";
import { newEphermalHttpRequest } from "providers/ReduxStore/slices/collections";
import { newHttpRequest } from "providers/ReduxStore/slices/collections/actions";
import { addTab } from "providers/ReduxStore/slices/tabs";
import HttpMethodSelector from "components/RequestPane/QueryUrl/HttpMethodSelector";
import StyledWrapper from "./StyledWrapper";

const NewRequest = ({ collection, item, isEphermal, onClose }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      requestName: "",
      requestType: "http-request",
      requestUrl: "",
      requestMethod: "GET",
    },
    validationSchema: Yup.object({
      requestName: Yup.string().min(1, "must be atleast 1 characters").max(50, "must be 50 characters or less").required("name is required"),
    }),
    onSubmit: (values) => {
      if (isEphermal) {
        const uid = uuid();
        dispatch(
          newEphermalHttpRequest({
            uid: uid,
            requestName: values.requestName,
            requestType: values.requestType,
            requestUrl: values.requestUrl,
            requestMethod: values.requestMethod,
            collectionUid: collection.uid,
          })
        )
          .then(() => {
            dispatch(
              addTab({
                uid: uid,
                collectionUid: collection.uid,
              })
            );
            onClose();
          })
          .catch(() => toast.error("An error occured while adding the request"));
      } else {
        dispatch(
          newHttpRequest({
            requestName: values.requestName,
            requestType: values.requestType,
            requestUrl: values.requestUrl,
            requestMethod: values.requestMethod,
            collectionUid: collection.uid,
            itemUid: item ? item.uid : null,
          })
        )
          .then(() => onClose())
          .catch(() => toast.error("An error occured while adding the request"));
      }
    },
  });

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const onSubmit = () => formik.handleSubmit();

  return (
    <StyledWrapper>
      <Modal size="md" title="New Request" confirmText="Create" handleConfirm={onSubmit} handleCancel={onClose}>
        <form className="bruno-form" onSubmit={formik.handleSubmit}>
          <div className="hidden">
            <label htmlFor="requestName" className="block font-semibold">
              Type
            </label>

            <div className="flex items-center mt-2">
              <input
                id="http"
                className="cursor-pointer"
                type="radio"
                name="requestType"
                onChange={formik.handleChange}
                value="http"
                checked={formik.values.requestType === "http-request"}
              />
              <label htmlFor="http" className="ml-1 cursor-pointer select-none">
                Http
              </label>

              <input
                id="graphql"
                className="ml-4 cursor-pointer"
                type="radio"
                name="requestType"
                onChange={(event) => {
                  formik.setFieldValue("requestMethod", "POST");
                  formik.handleChange(event);
                }}
                value="graphql"
                checked={formik.values.requestType === "graphql-request"}
              />
              <label htmlFor="graphql" className="ml-1 cursor-pointer select-none">
                Graphql
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="requestName" className="block font-semibold">
              Name
            </label>
            <input
              id="collection-name"
              type="text"
              name="requestName"
              ref={inputRef}
              className="block textbox mt-2 w-full"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onChange={formik.handleChange}
              value={formik.values.requestName || ""}
            />
            {formik.touched.requestName && formik.errors.requestName ? <div className="text-red-500">{formik.errors.requestName}</div> : null}
          </div>

          <div className="mt-4">
            <label htmlFor="request-url" className="block font-semibold">
              Url
            </label>

            <div className="flex items-center mt-2 ">
              <div className="flex items-center h-full method-selector-container">
                <HttpMethodSelector method={formik.values.requestMethod} onMethodSelect={(val) => formik.setFieldValue("requestMethod", val)} />
              </div>
              <div className="flex items-center flex-grow input-container h-full">
                <input
                  id="request-url"
                  type="text"
                  name="requestUrl"
                  className="px-3 w-full "
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  onChange={formik.handleChange}
                  value={formik.values.requestUrl || ""}
                />
              </div>
            </div>
            {formik.touched.requestUrl && formik.errors.requestUrl ? <div className="text-red-500">{formik.errors.requestUrl}</div> : null}
          </div>
        </form>
      </Modal>
    </StyledWrapper>
  );
};

export default NewRequest;
