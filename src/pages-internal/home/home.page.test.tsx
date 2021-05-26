import renderer from 'react-test-renderer';
import { HomePage } from './home.page';

describe('HomePage', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<HomePage postDescriptions={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
