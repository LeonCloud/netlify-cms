import React from 'react';
import styled, { css, keyframes } from 'react-emotion';
import CSSTransition from 'react-transition-group/CSSTransition';
import { colors } from './styles';

const styles = {
  disabled: css`
    display: none;
  `,
  active: css`
    display: block;
  `,
  enter: css`
    opacity: 0.01;
  `,
  enterActive: css`
    opacity: 1;
    transition: opacity 500ms ease-in;
  `,
  exit: css`
    opacity: 1;
  `,
  exitActive: css`
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  `,
};

const animations = {
  loader: keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `,
};

const LoaderText = styled.div`
  width: auto !important;
  height: auto !important;
  text-align: center;
  color: #767676;
  margin-top: 55px;
  line-height: 35px;
`

const LoaderItem = styled.div`
  position: absolute;
  white-space: nowrap;
  transform: translateX(-50%);
`

export class Loader extends React.Component {
  state = {
    currentItem: 0,
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setAnimation = () => {
    if (this.interval) return;
    const { children } = this.props;

    this.interval = setInterval(() => {
      const nextItem = (this.state.currentItem === children.length - 1) ? 0 : this.state.currentItem + 1;
      this.setState({ currentItem: nextItem });
    }, 5000);
  };

  renderChild = () => {
    const { children } = this.props;
    const { currentItem } = this.state;
    if (!children) {
      return null;
    } else if (typeof children == 'string') {
      return <LoaderText>{children}</LoaderText>;
    } else if (Array.isArray(children)) {
      this.setAnimation();
      return (
        <LoaderText>
          <CSSTransition
            classNames={{
              enter: styles.enter,
              enterActive: styles.enterActive,
              exit: styles.exit,
              exitActive: styles.exitActive,
            }}
            timeout={500}
          >
            <LoaderItem key={currentItem}>{children[currentItem]}</LoaderItem>
          </CSSTransition>
        </LoaderText>
      );
    }
  };

  render() {
    const { active, className } = this.props;
    return <div>{this.renderChild()}</div>;
  }
}

const StyledLoader = styled(Loader)`
  display: ${props => props.active ? 'block' : 'none'};
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0px;
  text-align: center;
  z-index: 1000;
  transform: translateX(-50%) translateY(-50%);

  &:before,
  &:after {
    width: 2.28571429rem;
    height: 2.28571429rem;
    margin: 0em 0em 0em -1.14285714rem;
  }

  /* Static Shape */
  &:before {
    position: absolute;
    content: '';
    top: 0%;
    left: 50%;
    border-radius: 500rem;
    border: 0.2em solid rgba(0, 0, 0, 0.1);
  }

  /* Active Shape */
  &:after {
    position: absolute;
    content: '';
    top: 0%;
    left: 50%;
    animation: ${animations.loader} 0.6s linear;
    animation-iteration-count: infinite;
    border-radius: 500rem;
    border-color: ${colors.active} transparent transparent;
    border-style: solid;
    border-width: 0.2em;
    box-shadow: 0px 0px 0px 1px transparent;
  }
`

export default StyledLoader;
