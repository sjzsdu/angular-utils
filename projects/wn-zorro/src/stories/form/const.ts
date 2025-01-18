import { FormItem } from '../../types';

export const userFormItems: FormItem[] = [
  // {
  //   name: 'username',
  //   type: 'groupForm',
  //   params: {
  //     items: [
  //       {
  //         name: 'firstName',
  //         type: 'input',
  //         label: { hideLabel: true },
  //         params: { nzAddOnBefore: 'First Name' },
  //         validates: ['minLength'],
  //         validatesArgs: {
  //           minLength: [2],
  //         },
  //         required: true,
  //       },
  //       {
  //         name: 'lastName',
  //         type: 'input',
  //         label: { hideLabel: true },
  //         params: { nzAddOnBefore: 'Last Name' },
  //         required: true,
  //         validates: ['minLength'],
  //         validatesArgs: {
  //           minLength: [2],
  //         },
  //       },
  //     ],
  //     layout: 'horizontal',
  //   },
  // },
  {
    name: 'subscribe',
    type: 'checkbox',
    label: {
      hideLabel: true,
      label: 'Subscribe to newsletter',
    },
  },
  {
    name: 'interests',
    type: 'checkboxGroup',
    label: {
      label: 'Interests',
      tooltip: 'Select your areas of interest',
    },
    params: {
      options: [
        { label: 'Technology', value: 'tech' },
        { label: 'Sports', value: 'sports' },
        { label: 'Music', value: 'music' },
        { label: 'Travel', value: 'travel' },
      ],
    },
  },
  {
    name: 'country',
    type: 'select',
    params: {
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Australia', value: 'au' },
      ],
      showSearch: true,
    },
  },
  {
    name: 'is_vip',
    type: 'switch',
    params: {
      checkedChildren: 'Yes',
      unCheckedChildren: 'No',
    },
  },
  {
    name: 'gender',
    type: 'radio',
    required: true,
    params: {
      options: ['male', 'female'],
    },
  },
  {
    name: 'male_item',
    type: 'input',
  },
  {
    name: 'female_item',
    type: 'input',
  },
  {
    name: 'email',
    type: 'input',
    validates: ['regexp'],
    validatesArgs: {
      regexp: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
    },
  },
  {
    name: 'age',
    type: 'number',
    params: {
      addonsAfter: 'years',
    },
    validates: ['min', 'max'],
    validatesArgs: {
      min: [5],
      max: [100],
    },
  },
];

export const companyFormItems = [];
