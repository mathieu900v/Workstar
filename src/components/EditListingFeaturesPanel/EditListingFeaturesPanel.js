import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';

import { LISTING_STATE_DRAFT } from '../../util/types';
import { ensureListing } from '../../util/data';
import { EditListingFeaturesForm } from '../../forms';
import { ListingLink } from '../../components';

import { types as sdkTypes } from '../../util/sdkLoader';
import config from '../../config';

import css from './EditListingFeaturesPanel.module.css';

const FEATURES_NAME = 'amenities';
const { Money } = sdkTypes;

const EditListingFeaturesPanel = props => {
  const {
    rootClassName,
    className,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureListing(listing);

  //Money object for distanceFees
  const { publicData } = currentListing.attributes;

  const distanceFees = 
  publicData && publicData.distanceFees ? publicData.distanceFees : null;

  const distanceFeesAsMoney = 
  distanceFees ? new Money(distanceFees.amount, distanceFees.currency) : null;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingFeaturesPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingFeaturesPanel.createListingTitle" />
  );

  const amenities = publicData && publicData.amenities;
  const initialValues = { amenities, distanceFees: distanceFeesAsMoney };
  const distanceFeesAsMoneyCurrencyValid = distanceFeesAsMoney instanceof Money ? distanceFeesAsMoney.currency === config.currency : true;
  const form = distanceFeesAsMoneyCurrencyValid ? (
    <EditListingFeaturesForm
        className={css.form}
        name={FEATURES_NAME}
        initialValues={initialValues}
        onSubmit={values => {
          const { amenities = [] } = values;
          
          //Pricing for km
          const { distanceFees = null } = values;

          const updatedValues = {
            publicData: { amenities, distanceFees: { amount: distanceFees.amount, currency: distanceFees.currency }},
          };
          onSubmit(updatedValues);
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
      />
  ) : (
    <div className={css.priceCurrencyInvalid}>
      <FormattedMessage id="EditListingPricingPanel.listingPriceCurrencyInvalid" />
    </div>
  );

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      {form}
    </div>
  );
};

EditListingFeaturesPanel.defaultProps = {
  rootClassName: null,
  className: null,
  listing: null,
};

const { bool, func, object, string } = PropTypes;

EditListingFeaturesPanel.propTypes = {
  rootClassName: string,
  className: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingFeaturesPanel;
