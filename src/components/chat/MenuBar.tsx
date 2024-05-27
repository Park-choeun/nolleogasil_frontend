import styled from "styled-components";
import {useEffect, useRef} from "react";

function MenuBar ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: any })
{

    const outside = useRef<any>();
    useEffect(() => {
        document.addEventListener('mousedown', handlerOutside);
        return () => {      document.removeEventListener('mousedown', handlerOutside);
        };
    });
        const handlerOutside = (e: any) => {
            if (!outside.current.contains(e.target)) {      toggleSide();    }
        };
        const toggleSide = () => {
            setIsOpen(false);  };

    return (
        <SideBarWrap id="sidebar" ref={outside} className={isOpen ? 'open' : ''}>
            <ul>
                <Menu>메뉴1</Menu>
                <Menu>메뉴2</Menu>
                <Menu>메뉴3</Menu>
            </ul>

        </SideBarWrap>
    );

}

export default MenuBar;

const SideBarWrap = styled.div`  
    z-index: 5;  
    padding: 12px; 
    border-radius: 15px 0 0 15px;  
    background-color: #e7e4e1;  
    height: 100%;  width: 55%;  right: -55%;  top: 0;  
    position: absolute; 
    transition: 0.5s ease;  
    &.open {  right: 0;    
              transition: 0.5s ease;  }`;
const Menu = styled.li`  margin: 30px 8px;`;
