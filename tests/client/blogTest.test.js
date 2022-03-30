/**
 * @jest-environment jsdom
 */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import Blog from '../../client/src/components/Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    author: 'Matti',
    title: 'Fishing',
    url: 'www.fishing.com',
    likes: '0',
    user: [{
      name: 'Heikki',
      username: 'heikki123'
    }]
  }

  const user = {
    name: 'Simo',
    username: 'simo123'
  }
  window.localStorage.setItem (
    'loggedUser', JSON.stringify(user))

  const likeHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} likeBlog={likeHandler} />
    )
  })

  test('renders intially author & title only', () => {
    expect(component.container).toHaveTextContent('Matti')
    expect(component.container).toHaveTextContent('Fishing')
    expect(component.container).not.toHaveTextContent('www.fishing.com')
    expect(component.container).not.toHaveTextContent('0')
  })

  test('when show -button is pressed shows also likes & url', () => {
    const button = screen.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('Matti')
    expect(component.container).toHaveTextContent('Fishing')
    expect(component.container).toHaveTextContent('www.fishing.com')
    expect(component.container).toHaveTextContent('likes')
    expect(component.container).toHaveTextContent('Heikki')
  })

  test('when like button is cliked twice, handler is called twice', () => {
    const view = screen.getByText('view')
    fireEvent.click(view)

    const like = screen.getByText('like')
    fireEvent.click(like)
    fireEvent.click(like)
    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})