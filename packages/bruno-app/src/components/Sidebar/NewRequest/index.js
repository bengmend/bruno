import React, { useRef, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { uuid } from 'utils/common';
import Modal from 'components/Modal';
import { useDispatch } from 'react-redux';
import { newEphemeralHttpRequest } from 'providers/ReduxStore/slices/collections';
import { newHttpRequest } from 'providers/ReduxStore/slices/collections/actions';
import { addTab } from 'providers/ReduxStore/slices/tabs';
import HttpMethodSelector from 'components/RequestPane/QueryUrl/HttpMethodSelector';
import { getDefaultRequestPaneTab } from 'utils/collections';
import StyledWrapper from './StyledWrapper';
import { getRequestFromCurlCommand } from 'utils/curl';

const NewRequest = ({ collection, item, isEphemeral, onClose }) => {
  const [curlError, setCurlError] = useState('');
  const dispatch = useDispatch();
  const inputRef = useRef();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      requestName: '',
      requestType: 'http-request',
      requestUrl: '',
      requestMethod: 'GET',
      curlCommand: ''
    },
    validationSchema: Yup.object({
      requestName: Yup.string()
        .trim()
        .min(1, 'must be at least 1 character')
        .required('name is required')
        .test({
          name: 'requestName',
          message: `The request names - collection and folder is reserved in bruno`,
          test: (value) => {
            const trimmedValue = value ? value.trim().toLowerCase() : '';
            return !['collection', 'folder'].includes(trimmedValue);
          }
        })
    }),
    onSubmit: (values) => {
      if (isEphemeral) {
        const uid = uuid();
        dispatch(
          newEphemeralHttpRequest({
            uid: uid,
            requestName: values.requestName,
            requestType: values.requestType,
            requestUrl: values.requestUrl,
            requestMethod: values.requestMethod,
            collectionUid: collection.uid
          })
        )
          .then(() => {
            dispatch(
              addTab({
                uid: uid,
                collectionUid: collection.uid,
                requestPaneTab: getDefaultRequestPaneTab({ type: values.requestType })
              })
            );
            onClose();
          })
          .catch((err) => toast.error(err ? err.message : 'An error occurred while adding the request'));
      } else if (values.requestType === 'from-curl') {
        const request = getRequestFromCurlCommand(values.curlCommand);
        if (request === null) {
          setCurlError('Invalid cURL Command');
        }
        dispatch(
          newHttpRequest({
            requestName: values.requestName,
            requestType: 'http-request',
            requestUrl: request.url,
            requestMethod: request.method,
            collectionUid: collection.uid,
            itemUid: item ? item.uid : null,
            headers: request.headers,
            body: request.body
          })
        )
          .then(() => onClose())
          .catch((err) => toast.error(err ? err.message : 'An error occurred while adding the request'));
      } else {
        dispatch(
          newHttpRequest({
            requestName: values.requestName,
            requestType: values.requestType,
            requestUrl: values.requestUrl,
            requestMethod: values.requestMethod,
            collectionUid: collection.uid,
            itemUid: item ? item.uid : null
          })
        )
          .then(() => onClose())
          .catch((err) => toast.error(err ? err.message : 'An error occurred while adding the request'));
      }
    }
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
          <div>
            <label htmlFor="requestName" className="block font-semibold">
              Type
            </label>

            <div className="flex items-center mt-2">
              <input
                id="http-request"
                className="cursor-pointer"
                type="radio"
                name="requestType"
                onChange={formik.handleChange}
                value="http-request"
                checked={formik.values.requestType === 'http-request'}
              />
              <label htmlFor="http-request" className="ml-1 cursor-pointer select-none">
                HTTP
              </label>

              <input
                id="graphql-request"
                className="ml-4 cursor-pointer"
                type="radio"
                name="requestType"
                onChange={(event) => {
                  formik.setFieldValue('requestMethod', 'POST');
                  formik.handleChange(event);
                }}
                value="graphql-request"
                checked={formik.values.requestType === 'graphql-request'}
              />
              <label htmlFor="graphql-request" className="ml-1 cursor-pointer select-none">
                GraphQL
              </label>

              <input
                id="from-curl"
                className="cursor-pointer ml-auto"
                type="radio"
                name="requestType"
                onChange={formik.handleChange}
                value="from-curl"
                checked={formik.values.requestType === 'from-curl'}
              />

              <label htmlFor="from-curl" className="ml-1 cursor-pointer select-none">
                From cURL
              </label>
            </div>
          </div>
          <div className="mt-4">
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
              value={formik.values.requestName || ''}
            />
            {formik.touched.requestName && formik.errors.requestName ? (
              <div className="text-red-500">{formik.errors.requestName}</div>
            ) : null}
          </div>
          {formik.values.requestType !== 'from-curl' ? (
            <>
              <div className="mt-4">
                <label htmlFor="request-url" className="block font-semibold">
                  URL
                </label>

                <div className="flex items-center mt-2 ">
                  <div className="flex items-center h-full method-selector-container">
                    <HttpMethodSelector
                      method={formik.values.requestMethod}
                      onMethodSelect={(val) => formik.setFieldValue('requestMethod', val)}
                    />
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
                      value={formik.values.requestUrl || ''}
                    />
                  </div>
                </div>
                {formik.touched.requestUrl && formik.errors.requestUrl ? (
                  <div className="text-red-500">{formik.errors.requestUrl}</div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="mt-4">
              <label htmlFor="request-url" className="block font-semibold">
                cURL Command
              </label>
              <textarea
                name="curlCommand"
                placeholder="Enter cURL request here.."
                className="block textbox w-full mt-4"
                style={{ resize: 'none' }}
                value={formik.values.curlCommand}
                onChange={formik.handleChange}
              ></textarea>
              {curlError !== '' && <div className="text-red-500">{curlError}</div>}
            </div>
          )}
        </form>
      </Modal>
    </StyledWrapper>
  );
};

export default NewRequest;
