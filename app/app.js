import React from 'react';
import { mount } from 'react-mounter';
import MainLayout from './layouts/MainLayout';
import HelloWorld from './containers/HelloWorld';

mount(MainLayout, {content: () => <HelloWorld />});

