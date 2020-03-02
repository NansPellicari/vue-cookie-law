import Vue from 'vue'
import { createLocalVue, mount } from 'vue-test-utils'
import sinon from 'sinon'
import CookieLaw from '@/components/CookieLaw'
import * as Cookie from 'tiny-cookie'

const localVue = createLocalVue()

describe('CookieLaw.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(CookieLaw)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.Cookie__content').textContent)
      .to.equal('This website uses cookies to ensure you get the best experience on our website.')
  })

  it('should call "isAccepted" method when mount ', async () => {
    const spy = sinon.stub()
    mount(CookieLaw, {
      methods: {
        isAccepted: spy
      }
    }, localVue)

    expect(spy.called).to.equal(true)
  })

  it('should set localstorage when clicking confirm button', () => {
    const Constructor = Vue.extend(CookieLaw)
    const vm = new Constructor().$mount()

    expect(vm.$el.querySelector('.Cookie__button').textContent)
      .to.equal('Got it!')

    expect(localStorage.getItem('cookie:accepted')).to.equal(null)

    vm.$el.querySelector('.Cookie__button').click()

    expect(localStorage.getItem('cookie:accepted')).to.equal('true')

    localStorage.clear()
  })
  it('should have an <a> tag with target="_blank" if buttonLinkNewTab prop is true', () => {
    const Constructor = Vue.extend(CookieLaw)
    const vm = new Constructor({ propsData: { buttonLink: 'link', buttonLinkNewTab: true } }).$mount()
    expect(vm.$el.querySelector('.Cookie__buttons > a').getAttribute('target'))
      .to.equal('_blank')
  })
  it('should set cookie when domain prop is not set', () => {
    const Constructor = Vue.extend(CookieLaw)
    const vm = new Constructor({ propsData: { storageType: 'cookies' } }).$mount()

    expect(Cookie.get('cookie:accepted')).to.equal(null)

    vm.$el.querySelector('.Cookie__button').click()

    expect(Cookie.get('cookie:accepted')).to.equal('true')

    Cookie.remove('cookie:accepted')
    Cookie.remove('cookie:all')
  })
  it('should set cookie when domain prop set', () => {
    const Constructor = Vue.extend(CookieLaw)
    const vm = new Constructor({
      propsData: { storageType: 'cookies', cookieOptions: { domain: 'localhost' } }
    }).$mount()

    expect(Cookie.get('cookie:accepted')).to.equal(null)

    vm.$el.querySelector('.Cookie__button').click()

    expect(Cookie.get('cookie:accepted')).to.equal('true')

    Cookie.remove('cookie:accepted', { domain: 'localhost' })
    Cookie.remove('cookie:all')
  })

  it('should trigger "accept" event when mounted if cookie has been already acccepted ', async () => {
    localStorage.setItem('cookie:all', 'true')

    const wrapper = mount(CookieLaw, localVue)

    expect(wrapper.emitted()).to.have.property('accept')

    localStorage.clear()
  })
  it('should NOT trigger "accept" event when mounted if cookie has been already acccepted ', async () => {
    const wrapper = mount(CookieLaw, localVue)

    expect(wrapper.emitted()).to.not.have.property('accept')

    localStorage.clear()
  })

  it('should trigger "revoke" event and remove previous user choice if revoke() method is called', async () => {
    const storageName = 'cookie:test'
    localStorage.setItem(storageName, 'true')

    const wrapper = mount(CookieLaw, {
      propsData: {
        storageName: storageName
      }
    }, localVue)

    wrapper.vm.revoke()

    expect(wrapper.emitted()).to.have.property('revoke')
    expect(localStorage.getItem(storageName)).to.be.equal(null)

    localStorage.clear()
  })
  // it('should set a cookie when localstorage is not available', () => {
  //   const Constructor = Vue.extend(CookieLaw)
  //   const vm = new Constructor().$mount()

  //   localStorage = null

  //   expect(Cookie.get('cookie:accepted')).to.equal(null)

  //   vm.$el.querySelector('.Cookie__button').click()

  //   expect(Cookie.get('cookie:accepted')).to.equal(true)
  // })
})
