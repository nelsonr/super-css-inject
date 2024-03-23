import { useRef } from "react";
import { getClassName } from "../utils";

interface IProps {
    search: string;
    onChange: (search: string) => unknown;
}

export function PopupSearch (props: IProps) {
    const { search, onChange } = props;
    const searchInputEl = useRef<HTMLInputElement>(null);

    const handleOnChange = () => {
        if (searchInputEl.current) {
            onChange(searchInputEl.current.value);
        }
    };

    const clearInput = () => {
        if (searchInputEl.current) {
            searchInputEl.current.focus();
            onChange("");
        }
    };

    const iconClassName = getClassName([
        "icon-cross",
        search.length > 0 ? "" : "hidden",
    ]);

    return (
        <div className="search">
            <svg
                className="icon-search"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="294 210 32 32"
                width="32pt"
                height="32pt"
            >
                <path
                    d=" M 316.564 231.253 C 318.412 229.093 319.44 226.336 319.44 223.475 C 319.44 220.306 318.18 217.266 315.94 215.022 C 313.7 212.782 310.656 211.526 307.491 211.526 C 304.322 211.526 301.278 212.782 299.038 215.022 C 296.798 217.266 295.538 220.306 295.538 223.475 C 295.538 226.644 296.798 229.684 299.038 231.928 L 299.038 231.928 C 301.278 234.168 304.322 235.424 307.491 235.424 C 310.336 235.424 313.084 234.409 315.237 232.576 L 322.862 240.205 C 323.038 240.38 323.28 240.478 323.526 240.478 C 323.776 240.478 324.014 240.38 324.189 240.205 C 324.365 240.029 324.462 239.787 324.462 239.541 C 324.462 239.292 324.365 239.054 324.189 238.878 L 316.564 231.253 Z  M 300.357 230.605 C 298.468 228.716 297.407 226.148 297.407 223.475 C 297.407 220.802 298.468 218.234 300.357 216.345 C 302.25 214.457 304.818 213.391 307.491 213.395 C 310.164 213.391 312.728 214.457 314.62 216.345 C 316.509 218.234 317.571 220.802 317.571 223.475 C 317.571 226.148 316.509 228.716 314.62 230.605 C 312.728 232.494 310.164 233.555 307.491 233.555 C 304.818 233.555 302.25 232.494 300.357 230.605 L 300.357 230.605 Z "
                    fillRule="evenodd"
                    fill="rgb(0,0,0)"
                ></path>
            </svg>

            <svg
                className={iconClassName}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="4.5 4.5 23 23"
                width="23pt"
                height="23pt"
                onClick={clearInput}
            >
                <path
                    d=" M 13.88 16 L 4.94 24.94 C 4.66 25.22 4.5 25.6 4.5 26 C 4.5 26.4 4.66 26.78 4.94 27.06 C 5.22 27.34 5.6 27.5 6 27.5 C 6.4 27.5 6.78 27.34 7.06 27.06 L 16 18.12 L 24.94 27.06 C 25.22 27.34 25.6 27.5 26 27.5 C 26.4 27.5 26.78 27.34 27.06 27.06 C 27.34 26.78 27.5 26.4 27.5 26 C 27.5 25.6 27.34 25.22 27.06 24.94 L 18.12 16 L 27.06 7.06 C 27.34 6.78 27.5 6.4 27.5 6 C 27.5 5.6 27.34 5.22 27.06 4.94 C 26.78 4.66 26.4 4.5 26 4.5 C 25.6 4.5 25.22 4.66 24.94 4.94 L 16 13.88 L 7.06 4.94 C 6.78 4.66 6.4 4.5 6 4.5 C 5.6 4.5 5.22 4.66 4.94 4.94 C 4.66 5.22 4.5 5.6 4.5 6 C 4.5 6.4 4.66 6.78 4.94 7.06 L 13.88 16 Z "
                    fill="rgb(0,0,0)"
                ></path>
            </svg>

            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleOnChange}
                ref={searchInputEl}
            />
        </div>
    );
}
