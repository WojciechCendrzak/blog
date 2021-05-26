import styled from 'styled-components';
import { translate, translationKeys } from '../../logic/translations/translation.service';
import { topMenuItems } from './menu.const';
import { LinkTo } from '../../components/link';

export const Menu = () => {
  return (
    <MenuContainer>
      {topMenuItems.map((route) => (
        <MenuItem key={route}>
          <LinkTo href={route}>{translate(translationKeys.site.routes[route])}</LinkTo>
        </MenuItem>
      ))}
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  margin-top: 32px;
  margin-right: 64px;
  display: flex;
  justify-content: flex-end;

  @media only screen and (max-width: 768px) {
    margin-top: 0;
    margin-right: 0;
    justify-content: center;
    border-bottom-color: black;
    border-bottom-style: solid;
    border-bottom-width: thin;
  }
`;

const MenuItem = styled.div`
  padding: 16px;
`;
