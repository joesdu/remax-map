export const getImageInfo = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    // 如果图片被缓存，则直接返回缓存数据
    if (img.complete) resolve(img);
    else {
      img.addEventListener('load', () => {
        resolve(img);
      });
      img.addEventListener('error', (err) => {
        reject(err);
      });
    }
  });

// 统一处理滚轮滚动事件
export const wheel = (event: { wheelDelta: number; detail: number }) => {
  let delta = 0;
  if (event.wheelDelta) {
    // IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
    delta = -(event.wheelDelta / 120); // 因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
  } else if (event.detail) delta = -event.detail / 3; // FF浏览器使用的是detail,其值为“正负3”
  return delta;
};
