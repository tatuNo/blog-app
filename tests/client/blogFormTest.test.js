/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import BlogForm from '../../client/src/components/BlogFrom'

describe('<BlogForm />', () => {

  test('updates parent state and calls onSubmit', () => {
    const createBlog = jest.fn()

    render(
      <BlogForm createBlog={createBlog} />
    )

    const title = screen.getByTestId('title')
    const author = screen.getByTestId('author')
    const url = screen.getByTestId('url')
    const submit = screen.getByRole('button')

    const expectedObject = {
      title: 'Fishing',
      author: 'Matti',
      url: 'www.fishing.com'
    }

    fireEvent.change(title, {
      target: { value: expectedObject.title }
    })
    fireEvent.change(author, {
      target: { value: expectedObject.author }
    })
    fireEvent.change(url, {
      target: { value: expectedObject.url }
    })
    fireEvent.click(submit)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(expectedObject)
  })
})