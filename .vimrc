if has("autocmd")
    " configure expanding of tabs for various file types
    au BufRead,BufNewFile *.py          set expandtab
    au BufRead,BufNewFile *.py          set list
    au BufRead,BufNewFile *.h           set noexpandtab
    au BufRead,BufNewFile *.c           set noexpandtab
    au BufRead,BufNewFile *.cpp         set noexpandtab
    au BufRead,BufNewFile *.h           set list
    au BufRead,BufNewFile *.c           set list
    au BufRead,BufNewFile *.cpp         set list
endif

" GNUmakefile Makefile *.mk
if has("autocmd")

    autocmd FileType make               set noexpandtab
    autocmd FileType make               set softtabstop=4
    autocmd FileType make               set list

    au BufRead,BufNewFile Makefile      set noexpandtab
    au BufRead,BufNewFile Makefile      set softtabstop=4
    au BufRead,BufNewFile Makefile      set list

    au BufRead,BufNewFile GNUmakefile   set noexpandtab
    au BufRead,BufNewFile GNUmakefile   set softtabstop=4
    au BufRead,BufNewFile GNUmakefile   set list

    au BufRead,BufNewFile *.sh*         set list
    au BufRead,BufNewFile *.vimrc*      set list
    au BufRead,BufNewFile *.vimrc*      set noexpandtab

    au BufRead,BufNewFile *ockerfile*   set noexpandtab list
    au BufRead,BufNewFile *.yml         set noexpandtab softtabstop=2 list
    au BufRead,BufNewFile *.yaml        set noexpandtab softtabstop=2 list

    au BufRead,BufNewFile *.md          set noexpandtab
    au BufRead,BufNewFile *.md          set softtabstop=4
    " au BufRead,BufNewFile *.md        set expandtab!
    au BufRead,BufNewFile *.md          set list
endif

" make backspaces more powerfull
set backspace=indent,eol,start

set ruler               " show line and column number
syntax on               " syntax highlighting
set showcmd             " show (partial) command in status line

" SOLARIZED HEX     16/8 TERMCOL  XTERM/HEX   L*A*B      sRGB        HSB
" --------- ------- ---- -------  ----------- ---------- ----------- -----------
" base03    #002b36  8/4 brblack  234 #1c1c1c 15 -12 -12   0  43  54 193 100  21
" base02    #073642  0/4 black    235 #262626 20 -12 -12   7  54  66 192  90  26
" base01    #586e75 10/7 brgreen  240 #4e4e4e 45 -07 -07  88 110 117 194  25  46
" base00    #657b83 11/7 bryellow 241 #585858 50 -07 -07 101 123 131 195  23  51
" base0     #839496 12/6 brblue   244 #808080 60 -06 -03 131 148 150 186  13  59
" base1     #93a1a1 14/4 brcyan   245 #8a8a8a 65 -05 -02 147 161 161 180   9  63
" base2     #eee8d5  7/7 white    254 #d7d7af 92 -00  10 238 232 213  44  11  93
" base3     #fdf6e3 15/7 brwhite  230 #ffffd7 97  00  10 253 246 227  44  10  99
" yellow    #b58900  3/3 yellow   136 #af8700 60  10  65 181 137   0  45 100  71
" orange    #cb4b16  9/3 brred    166 #d75f00 50  50  55 203  75  22  18  89  80
" red       #dc322f  1/1 red      160 #d70000 50  65  45 220  50  47   1  79  86
" magenta   #d33682  5/5 magenta  125 #af005f 50  65 -05 211  54 130 331  74  83
" violet    #6c71c4 13/5 brmagenta 61 #5f5faf 50  15 -45 108 113 196 237  45  77
" blue      #268bd2  4/4 blue      33 #0087ff 55 -10 -45  38 139 210 205  82  82
" cyan      #2aa198  6/6 cyan      37 #00afaf 60 -35 -05  42 161 152 175  74  63
" green     #859900  2/2 green     64 #5f8700 60 -20  65 133 153   0  68 100  60

if has("gui_running")
set background=dark
let g:solarized_termcolors=256
    set termguicolors
    colorscheme solarized
else
set background=dark
let g:solarized_termcolors=256
    set termguicolors
    colorscheme solarized
endif

set colorcolumn=40,50,79,81,129,131,159,161,209,211
highlight TabLineSel             cterm=underline,reverse cterm=underline,reverse ctermfg=0 ctermbg=0 gui=bold
highlight TabLineFill            cterm=underline cterm=underline ctermfg=12 ctermbg=0 gui=reverse
highlight CursorLine                      ctermbg=red guibg=blue
highlight CursorColumn                    ctermbg=red guibg=blue
highlight LightlineRight_tabline_0        ctermfg=0 ctermbg=0 guifg=#a8a8a8 guibg=#666666
highlight LightlineRight_tabline_0_1      ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
highlight LightlineRight_tabline_0_tabsel ctermfg=0 ctermbg=0 guifg=#666666 guibg=#242424
highlight LightlineRight_tabline_tabsel   ctermfg=0 ctermbg=0 guifg=#d0d0d0 guibg=#242424
highlight LightlineRight_tabline_tabsel_0 ctermfg=0 ctermbg=0 guifg=#242424 guibg=#666666
highlight LightlineRight_inactive_1       ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444

highlight LightlinLeft_tabline_0          ctermfg=0 ctermbg=0 guifg=#a8a8a8 guibg=#666666
highlight LightlinLeft_tabline_0_1        ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444
highlight LightlinLeft_tabline_0_tabsel   ctermfg=0 ctermbg=0 guifg=#666666 guibg=#242424
highlight LightlinLeft_tabline_tabsel     ctermfg=0 ctermbg=0 guifg=#d0d0d0 guibg=#242424
highlight LightlinLeft_tabline_tabsel_0   ctermfg=0 ctermbg=0 guifg=#242424 guibg=#666666
highlight LightlinLeft_inactive_1         ctermfg=0 ctermbg=0 guifg=#666666 guibg=#444444


" TOGGLE INVISIBLES
" backslash l
let mapleader = "\\"
nmap <leader>l :set list!<CR>
set listchars=tab:▸\ ,eol:¬

" NERDTree defaults
nmap <leader>n :NERDTreeToggle<CR>
" backslash n
let g:NERDTreeFileExtensionHighlightFullName = 1
let NERDTreeWinPos=0
let NERDTreeShowHidden=1

autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") && v:this_session == "" | NERDTree | endif
"
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | exe 'cd '.argv()[0] | endif

