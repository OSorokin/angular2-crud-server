import {RouteBuilder, RouteFiller} from '../../../main/routes/index';
import {assert, AssertionError} from 'chai';
import * as util from 'util';

describe('RouteBuilderTest', () => {

  it('valid', () => {
    valid('/location', '/location');
    valid('/location/some', '/location/some');
    valid('/location/1', '/location/:id', {id: 1});
    valid('/location/foo', '/location/:some', {some: 'foo'});
    valid('/location/with-dash', '/location/:some', {some: 'with-dash'});
    valid('/location/foo/42', '/location/:some/:id', {some: 'foo', id: 42});
    valid('/location/foo/bar', '/location/:some/:another', {some: 'foo', another: 'bar'});
    valid('/17/location/foo', '/:id/location/:some', {some: 'foo', id: 17});
  });

  it('valid. same parameter multiple times', () => {
    valid('/location/1/1', '/location/:a/:a', {a: 1});
    valid('/location/some/42/42/some/17', '/location/:a/:b/:b/:a/:c', {a: 'some', b: 42, c: 17});
  });

  it('invalid. location missed', () => {
    invalid('routeLocation missed', null);
    invalid('routeLocation missed', undefined);
  });

  it('invalid. redundant parameters', () => {
    invalid('redundant parameters: some(1)', '/location', {some: 1});
    invalid('redundant parameters: foo(bar)', '/location/:id', {id: 1, foo: 'bar'});
    invalid('redundant parameters: bar(1),foo(42)', '/location/:id', {id: 1, foo: 42, bar: 1});
  });

  it('invalid. invalid string parameters values', () => {
    invalid('invalid string parameters values: some(:bgugaga)', '', {some: ':bgugaga'});
    invalid('invalid string parameters values: foo(UPPERCASE)', '', {foo: 'UPPERCASE'});
    invalid('invalid string parameters values: foo(12)', '', {foo: '12'});
    invalid('invalid string parameters values: foo(по-русски)', '', {foo: 'по-русски'});
    invalid('invalid string parameters values: foo(with space)', '', {foo: 'with space'});
    invalid('invalid string parameters values: bar(:bar),foo(:foo)', '', {foo: ':foo', bar: ':bar'});
  });

  it('invalid. invalid parameters types', () => {
    invalid('invalid parameters types: some(object)', '', {some: {}});
    invalid('invalid parameters types: bar(object),foo(object)', '', {foo: new Error(), bar: []});
    invalid('invalid parameters types: bar(object),baz(object),foo(object)', '', {foo: new Error('foo'), bar: [1,2], baz: {some: 42}});
  });

  it('invalid. not all parameteres resolved', () => {
    invalid('location still has unresolved parameter(s): /location/:id', '/location/:id');
    invalid('location still has unresolved parameter(s): /location/:id/foo', '/location/:id/:some', {some: 'foo'});
  });

  it('webapp showcase', () => {
    const Locations = {
      SOMEWHERE: '/admin/companies/:id'
    };
    valid('/admin/companies/42', Locations.SOMEWHERE, {id: 42});
  });

  function valid(result: string, location: string, filler?: RouteFiller): void {
    try {
      assert.equal(
        RouteBuilder.build(location, filler),
        result,
        `valid case error for -> location: ${location}, filler: ${util.inspect(filler)}, expected result: ${result}`
      );
    } catch (e) {
      throw new AssertionError(
        `got error '${e.message}' for location: ${location}, filler: ${util.inspect(filler)}, expected result: ${result}`
      )
    }
  }

  function invalid(error: string, location: string, filler?: any): void {
    try {
      RouteBuilder.build(location, filler);
    } catch (e) {
      assert.equal(
        e.message,
        error,
        `invalid case error (NOT_EQUAL_ERROR) for -> location: ${location}, filler: ${util.inspect(filler)}`
      );
      return;
    }

    throw new AssertionError(
      `invalid case error (NO_ERROR) for -> location: ${location}, filler: ${util.inspect(filler)}`
    );
  }

});
