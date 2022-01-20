import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  dataTemplate: [
    {
      title: 'Courier Preference',
      type: 'String',
    },
    {
      title: 'Title',
      type: 'String',
    },
    {
      title: 'Given Name',
      type: 'String',
    },
    {
      title: 'Last Name',
      type: 'String',
    },
    {
      title: 'Card Validity',
      type: 'String',
    },
    {
      title: 'Nationality',
      type: 'String',
    },
    {
      title: 'Date of Birth',
      type: 'Date',
    },
    {
      title: 'Place of Birth',
      type: 'String',
    },
    {
      title: 'Marital Status',
      type: 'String',
    },
    {
      title: 'Religion',
      type: 'String',
    },
    {
      title: 'Job Title',
      type: 'String',
    },
    {
      title: 'Passport Number',
      type: 'Number',
    },
    {
      title: 'Passport Place of Issue',
      type: 'String',
    },
    {
      title: 'Passport Issued Country',
      type: 'String',
    },
    {
      title: 'Passport Issue Date',
      type: 'Date',
    },
    {
      title: 'Passport Expiry Date',
      type: 'Date',
    },
    {
      title: 'Permanent Native Address',
      type: 'String',
    },
    {
      title: 'Sponsor Details',
      type: 'String',
    },
    {
      title: 'Sponsor Contact Name',
      type: 'Number',
    },
    {
      title: 'Sponsor Emirates',
      type: 'String',
    },
    {
      title: 'Specific Reason or additional information for Authority',
      type: 'String',
    },
  ],
  receivedData: {},
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    sendFormData: (state, action) => {
      // console.log(actions.payload);
      receivedData = action.payload;
      console.log(receivedData);
    },
  },
});

export const {sendFormData} = dataSlice.actions;

export default dataSlice.reducer;
