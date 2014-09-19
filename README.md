Annotation:
=======
目前主要通过<code>models</code>文件夹下的几个.js文件抓取数据并保存。                       
1.<code>matters42.js</code>文件通过TopAPI抓取42matters上国内的Top100的APP，并保存至<code>ProductList</code>，标记<code>source</code>为1；                           
2.<code>ph.js</code>通过爬虫抓取ProductHunt上的Product，目前只抓取Name和Redirect前的URL，并保存至<code>ProductList</code>，标记<code>source</code>为2；                         
3.<code>next.js</code>通过爬虫抓取36Kr next上的Product，目前只抓取Name和Redirect前的URL，并保存至<code>ProductList</code>，标记<code>source</code>为3；                     
4.<code>dMatters.js</code>查询并返回<code>ProductList</code>上<code>source</code>为1的ProductId</code>，通过42matters上的LookupAPI分别抓取对应的productDetail，并保存至<code>ProductDetail</code>，并将<code>ProductList</code>中的<code>pid</code>作为外键映射到<code>ProductDetail</code>。
                              
-------------------------------------------------------

To DO：
=====
1.抓取36Kr和ProductHunt上的vote并保存至<code>ProductDetail</code>                                 
2.去重                           
3.获取Redirect后的URL                                  
