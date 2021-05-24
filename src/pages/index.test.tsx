import renderer from 'react-test-renderer';
import HomePage from '.';

describe('HomePage', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<HomePage allPostsData={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
