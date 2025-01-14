import { useSelector } from 'react-redux';
import { appState } from '../../../../app/slices/appSlice';
import PostContainer from '../containers/CardContainer';

const CardType = (props) => {
  const currentAppState = useSelector(appState);
  const {cardComponent} = currentAppState;
  const {type} = cardComponent;

  const renderComponent = () => {
    let newProps = {...props};
    switch(type) {
      case 'ROOT':
        newProps.type = 'ROOT';
        return <PostContainer {...newProps}/>
      case 'TAG':
        newProps.type = 'TAG';
        return <PostContainer {...newProps}/>
      case 'POST':
        newProps.type = 'POST';
        return <PostContainer {...newProps}/>
      default:
        return null;
    }
  }

  return(renderComponent())
}
  
export default CardType